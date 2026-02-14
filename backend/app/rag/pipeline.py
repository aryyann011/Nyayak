import os
import re
import torch
from typing import List

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

from transformers import AutoTokenizer, AutoModelForCausalLM
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


# ==========================================
# DEVICE & PATH SETUP
# ==========================================
device = "cuda" if torch.cuda.is_available() else "cpu"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_PATH = os.path.join(BASE_DIR, "..", "faiss_index")

if not os.path.exists(INDEX_PATH):
    INDEX_PATH = os.path.join(os.getcwd(), "faiss_index")


# ==========================================
# LOAD EMBEDDING MODEL
# ==========================================
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": device}
)

vectorstore = None
if os.path.exists(INDEX_PATH):
    vectorstore = FAISS.load_local(
        INDEX_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )


# ==========================================
# LOAD LLM (ONLY ONCE)
# ==========================================
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
    device_map="auto" if device == "cuda" else None,
).to(device)

model.eval()


# ==========================================
# STATIC LEGAL KNOWLEDGE BASE
# ==========================================
LEGAL_TERMS = {
    "fir": "FIR (First Information Report) is recorded under Section 154 CrPC for cognizable offenses.",
    "bail": "Bail allows temporary release from custody under provisions of CrPC.",
    "cognizable": "Police can arrest without warrant in cognizable offenses.",
    "non-cognizable": "Police need court approval in non-cognizable offenses.",
    "crpc": "CrPC 1973 governs criminal procedure in India.",
    "ipc": "IPC 1860 defines criminal offenses in India.",
    "tenant": "Tenant rights are protected under Rent Control Acts.",
    "cybercrime": "Cybercrime is punishable under the IT Act 2000.",
    "domestic violence": "Governed under the Protection of Women from Domestic Violence Act, 2005."
}


# ==========================================
# HELPERS
# ==========================================
def extract_text(file_input: str) -> str:
    if not file_input:
        return ""

    if isinstance(file_input, str) and file_input.lower().endswith(".pdf"):
        if not fitz or not os.path.exists(file_input):
            return ""

        text = ""
        with fitz.open(file_input) as doc:
            for page in doc:
                text += page.get_text()
        return text

    return str(file_input)


def get_legal_term_context(query: str) -> str:
    query_lower = query.lower()
    matches = [
        definition for term, definition in LEGAL_TERMS.items()
        if term in query_lower
    ]
    return " ".join(matches)


def retrieve_faiss_context(query: str, k: int = 3):
    if not vectorstore:
        return [], []

    try:
        docs_with_scores = vectorstore.similarity_search_with_score(query, k=k)
        filtered_docs = [(doc, score) for doc, score in docs_with_scores if score < 1.2]

        texts = [doc.page_content for doc, _ in filtered_docs]
        sources = list(set(doc.metadata.get("source", "unknown") for doc, _ in filtered_docs))

        return texts, sources
    except Exception:
        return [], []


# ==========================================
# MAIN RAG FUNCTION
# ==========================================
def ask_question_with_doc(query: str, uploaded_input: str = None):

    query_clean = query.strip().lower()

    # ==========================================
    # 1️⃣ SMART GUARDRAILS
    # ==========================================

    # Greeting variations (hi, hii, hellooo, heyyy)
    if re.match(r"^(hi+|hello+|hey+|namaste+)", query_clean):
        return {
            "answer": "Hello! I am NyaySetu AI. How can I assist you with your legal question today?",
            "sources": [],
            "confidence": 100,
            "disclaimer": ""
        }

    # Thanks variations
    if re.search(r"(thank|thanks|shukriya)", query_clean):
        return {
            "answer": "You're very welcome! Feel free to ask if you have any more legal questions.",
            "sources": [],
            "confidence": 100,
            "disclaimer": ""
        }

    # Very short meaningless queries
    if len(query_clean.split()) <= 2:
        return {
            "answer": "Could you please describe your legal issue in more detail?",
            "sources": [],
            "confidence": 100,
            "disclaimer": ""
        }

    # Normalize vague arrest queries
    if "arrest" in query_clean and len(query_clean.split()) < 6:
        query = "What should I do if I am arrested in India and what are my legal rights?"

    # ==========================================
    # 2️⃣ CONTEXT RETRIEVAL
    # ==========================================
    uploaded_text = extract_text(uploaded_input)
    legal_term_context = get_legal_term_context(query)
    faiss_texts, sources = retrieve_faiss_context(query)

    context_parts = []

    if uploaded_text.strip():
        context_parts.append("[UPLOADED DOCUMENT]\n" + uploaded_text[:1200])

    if legal_term_context:
        context_parts.append("[LEGAL DEFINITIONS]\n" + legal_term_context)

    if faiss_texts:
        context_parts.append("[LEGAL PROCEDURES]\n" + "\n".join(text[:800] for text in faiss_texts))

    context = "\n\n".join(context_parts) if context_parts else "No relevant legal context found."


    # ==========================================
    # 3️⃣ DYNAMIC LENGTH CONTROL
    # ==========================================
    word_count = len(query.split())

    if word_count <= 8:
        max_tokens = 120
    elif word_count <= 20:
        max_tokens = 250
    else:
        max_tokens = 400


    # ==========================================
    # 4️⃣ LLM PROMPTING
    # ==========================================
    system_prompt = """You are a professional Indian legal assistant.

Guidelines:
- Use clear and practical language.
- Answer briefly if the question is simple.
- Provide moderate explanation only if necessary.
- Do not hallucinate laws.
- If unsure, advise consulting a qualified lawyer.
- Only mention specific legal sections if present in context.
"""

    prompt = f"<|system|>\n{system_prompt}</s>\n<|user|>\nContext:\n{context}\n\nQuestion: {query}</s>\n<|assistant|>\n"

    inputs = tokenizer(prompt, return_tensors="pt").to(device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            temperature=0.2,
            top_p=0.8,
            repetition_penalty=1.2,
            eos_token_id=tokenizer.eos_token_id
        )

    generated = outputs[0][inputs["input_ids"].shape[-1]:]
    answer = tokenizer.decode(generated, skip_special_tokens=True).strip()

    # ==========================================
    # 5️⃣ CLEAN OUTPUT
    # ==========================================
    answer = re.sub(r"\*\*.*?\*\*", "", answer)
    answer = re.sub(r"\s+", " ", answer).strip()

    if not answer or len(answer) < 15:
        answer = "I am unable to provide a clear legal answer based on the available context. Please consult a qualified legal professional."


    # ==========================================
    # 6️⃣ CONFIDENCE SCORE
    # ==========================================
    if faiss_texts:
        confidence = 90
    elif legal_term_context:
        confidence = 80
    else:
        confidence = 65


    return {
        "answer": answer,
        "sources": sources,
        "disclaimer": "This is an AI-generated informational response based on Indian law. It is not legal advice.",
        "confidence": confidence
    }

