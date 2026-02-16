import os
import re
from dotenv import load_dotenv
from google import genai
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# ==========================================
# LOAD ENV
# ==========================================
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# ==========================================
# GEMINI CLIENT (NEW SDK)
# ==========================================
client = genai.Client(api_key=api_key)

# ==========================================
# PATHS
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_INDEX_PATH = os.path.join(BASE_DIR, "..", "..", "faiss_base")
UPLOADED_INDEX_PATH = os.path.join(BASE_DIR, "..", "..", "faiss_uploaded")

# Ensure upload folder exists
os.makedirs(UPLOADED_INDEX_PATH, exist_ok=True)

# ==========================================
# EMBEDDINGS
# ==========================================
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# ==========================================
# LOAD BASE INDEX
# ==========================================
base_store = None
if os.path.exists(BASE_INDEX_PATH):
    base_store = FAISS.load_local(
        BASE_INDEX_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )

# ==========================================
# STATIC FALLBACK TERMS
# ==========================================
LEGAL_TERMS = {
    "fir": "FIR is recorded under Section 154 CrPC.",
    "bail": "Bail allows temporary release under CrPC provisions.",
    "ipc": "IPC 1860 defines criminal offences."
}

# ==========================================
# BUILD UPLOADED INDEX
# ==========================================
def build_uploaded_index(text: str):
    if not text.strip():
        return

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_text(text)

    if not chunks:
        return

    store = FAISS.from_texts(chunks, embeddings)
    store.save_local(UPLOADED_INDEX_PATH)


def load_uploaded_index():
    if os.path.exists(os.path.join(UPLOADED_INDEX_PATH, "index.faiss")):
        return FAISS.load_local(
            UPLOADED_INDEX_PATH,
            embeddings,
            allow_dangerous_deserialization=True
        )
    return None


# ==========================================
# RETRIEVE CONTEXT
# ==========================================
def retrieve_context(query: str):
    uploaded_store = load_uploaded_index()

    # Priority 1: Uploaded PDF
    if uploaded_store:
        docs = uploaded_store.similarity_search(query, k=3)
        return [d.page_content for d in docs], "uploaded"

    # Priority 2: Base Knowledge
    if base_store:
        docs = base_store.similarity_search(query, k=3)
        return [d.page_content for d in docs], "base"

    return [], "none"


# ==========================================
# MAIN FUNCTION
# ==========================================
def ask_question_with_doc(query: str, uploaded_text: str = None):

    try:
        query_clean = query.strip().lower()

        # Greeting Guard
        if re.match(r"^(hi+|hello+|hey+|namaste+)", query_clean):
            return {
                "answer": "Hello! I am NyaySetu AI. How can I assist you?",
                "mode": "greeting",
                "confidence": 100
            }

        # Build uploaded index safely
        if uploaded_text and uploaded_text.strip():
            build_uploaded_index(uploaded_text)

        # Retrieve context
        contexts, mode = retrieve_context(query)

        # Static fallback
        if not contexts:
            fallback = ""
            for term, definition in LEGAL_TERMS.items():
                if term in query_clean:
                    fallback += definition + " "

            if fallback:
                contexts = [fallback]
                mode = "static"

        context_text = "\n\n".join(contexts) if contexts else "No context found."

        system_prompt = """
You are a professional Indian legal assistant.

Guidelines:
- Use the provided context as the primary source when it is relevant.
- When the context is missing or incomplete, rely on your general knowledge of Indian law.
- If you are still unsure, say that you are not certain and recommend consulting a qualified lawyer.
- Be clear, practical and concise.
"""

        prompt = f"""
{system_prompt}

Context:
{context_text}

Question:
{query}
"""

        # Gemini call (correct content format)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ]
        )

        answer = response.text.strip() if response.text else \
            "I am unable to provide a clear legal answer based on the available information. Please consult a qualified legal professional."
        answer = re.sub(r"\s+", " ", answer).strip()

        confidence = 95 if mode == "uploaded" else \
                     85 if mode == "base" else \
                     70 if mode == "static" else 50

        return {
            "answer": answer,
            "mode": mode,
            "confidence": confidence,
            "disclaimer": "AI-generated informational response. Not legal advice."
        }

    except Exception as e:
        print("FULL ERROR:", str(e))
        return {
            "answer": f"Internal error: {str(e)}",
            "mode": "error",
            "confidence": 0
        }
