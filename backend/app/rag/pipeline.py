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
    "fir": "FIR (First Information Report) is the first official record made by police when a cognizable offense is reported under Section 154 CrPC.",
    "bail": "Bail is a legal arrangement allowing a person to be released from custody pending trial under provisions of CrPC.",
    "cognizable": "A cognizable offense allows police to arrest without warrant and start investigation without court approval.",
    "non-cognizable": "A non-cognizable offense requires a warrant and court approval for investigation.",
    "crpc": "CrPC (Code of Criminal Procedure, 1973) governs criminal procedure in India.",
    "ipc": "IPC (Indian Penal Code, 1860) defines criminal offenses in India.",
    "tenant": "Tenant rights are protected under Rent Control Acts and Transfer of Property Act.",
    "cybercrime": "Cybercrime is punishable under the IT Act 2000 and IPC provisions.",
    "domestic violence": "Domestic violence is governed under the Protection of Women from Domestic Violence Act, 2005."
}


# ==========================================
# HELPERS
# ==========================================
def extract_text(file_input: str) -> str:
    """Extract text from PDF or raw string."""
    if not file_input:
        return ""

    if isinstance(file_input, str) and file_input.lower().endswith(".pdf"):
        if not fitz:
            return ""
        if not os.path.exists(file_input):
            return ""

        text = ""
        with fitz.open(file_input) as doc:
            for page in doc:
                text += page.get_text()
        return text

    return str(file_input)


def get_legal_term_context(query: str) -> str:
    query_lower = query.lower()
    matches = [definition for term, definition in LEGAL_TERMS.items()
               if term in query_lower]
    return " ".join(matches)


def retrieve_faiss_context(query: str, k: int = 3):
    if not vectorstore:
        return [], []

    try:
        docs_with_scores = vectorstore.similarity_search_with_score(query, k=k)

        # Filter weak matches
        filtered_docs = [(doc, score) for doc, score in docs_with_scores if score < 1.2]

        texts = [doc.page_content for doc, _ in filtered_docs]
        sources = list(
            set(doc.metadata.get("source", "unknown") for doc, _ in filtered_docs)
        )

        return texts, sources

    except Exception:
        return [], []


# ==========================================
# MAIN RAG FUNCTION
# ==========================================
def ask_question_with_doc(query: str, uploaded_input: str = None):
    """
    Main RAG pipeline with Guardrails, Context Retrieval, and Dynamic Length Control.
    """
    query_clean = query.strip().lower()

    # ==========================================
    # 1️⃣ Basic Guardrails (Fast exits)
    # ==========================================
    greetings = ["hello", "hi", "hey", "good morning", "good evening", "namaste"]
    thanks = ["thanks", "thank you", "shukriya"]

    if query_clean in greetings:
        return {
            "answer": "Hello! I am NyaySetu AI. How can I assist you with your legal question today?",
            "sources": [],
            "confidence": 100,
            "disclaimer": ""
        }

    if len(query_clean) < 3:
        return {
            "answer": "I'm sorry, I didn't quite catch that. Could you please provide more details about your legal query?",
            "sources": [],
            "confidence": 100,
            "disclaimer": ""
        }

    if any(word in query_clean for word in thanks):
        return {
            "answer": "You're very welcome! Feel free to ask if you have any more legal questions.",
            "sources": [],
            "confidence": 100,
            "disclaimer": ""
        }

    # Normalize specific common vague queries
    if "what if i arrest" in query_clean or "arrest" in query_clean and len(query_clean.split()) < 5:
        query = "What should I do if I am arrested in India and what are my basic rights?"

    # ==========================================
    # 2️⃣ Context Retrieval
    # ==========================================
    uploaded_text = extract_text(uploaded_input)
    legal_term_context = get_legal_term_context(query)
    faiss_texts, sources = retrieve_faiss_context(query)

    context_parts = []

    if uploaded_text.strip():
        context_parts.append("[UPLOADED DOCUMENT]\n" + uploaded_text[:1500])

    if legal_term_context:
        context_parts.append("[LEGAL DEFINITIONS]\n" + legal_term_context)

    if faiss_texts:
        context_parts.append("[LEGAL PROCEDURES]\n" + "\n".join(text[:800] for text in faiss_texts))

    context = "\n\n".join(context_parts) if context_parts else "No specific legal documents retrieved."

    # ==========================================
    # 3️⃣ Dynamic Length Control
    # ==========================================
    word_count = len(query.split())
    if word_count <= 5:
        max_tokens = 150
    elif word_count <= 15:
        max_tokens = 250
    else:
        max_tokens = 450

    # ==========================================
    # 4️⃣ LLM Prompting & Generation
    # ==========================================
    system_prompt = """You are a professional Indian legal assistant. 
Guidelines:
- Answer based on the complexity of the question.
- Use simple and practical language.
- If the question is simple, respond briefly (2–3 sentences).
- Provide moderate detail only when necessary.
- Do not hallucinate laws; if unsure, advise consulting a lawyer.
- Mention specific sections like CrPC or IPC only if they are in the context."""

    prompt = f"<|system|>\n{system_prompt}</s>\n<|user|>\nContext: {context}\n\nQuestion: {query}</s>\n<|assistant|>\n"

    inputs = tokenizer(prompt, return_tensors="pt").to(device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            temperature=0.3,
            top_p=0.85,
            repetition_penalty=1.15,
            eos_token_id=tokenizer.eos_token_id
        )

    generated = outputs[0][inputs["input_ids"].shape[-1]:]
    answer = tokenizer.decode(generated, skip_special_tokens=True).strip()

    # ==========================================
    # 5️⃣ Clean Output
    # ==========================================
    # We remove bolding and clean spacing to fit your "flowing paragraph" requirement
    answer = re.sub(r"\*\*.*?\*\*", "", answer)
    answer = re.sub(r"\s+", " ", answer).strip()

    if not answer or len(answer) < 10:
        answer = "I am unable to provide a specific legal answer based on the current context. Please provide more details or consult a legal professional."

    # ==========================================
    # 6️⃣ Confidence & Return
    # ==========================================
    if faiss_texts:
        confidence = 90
    elif legal_term_context:
        confidence = 80
    else:
        confidence = 65

    return {
        "answer": answer,
        "disclaimer": "This is an AI-generated informational response based on Indian Law. It is not legal advice.",
        "confidence": confidence
    }
##lelo