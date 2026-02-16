import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(CURRENT_DIR)
INDEX_PATH = os.path.join(APP_DIR, "faiss_index")

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = None

if os.path.exists(INDEX_PATH):
    vectorstore = FAISS.load_local(
        INDEX_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )
    print("✅ FAISS loaded")
else:
    print("⚠️ No FAISS index found")


def retrieve_chunks(question: str, k: int = 4):
    if not vectorstore:
        return []

    docs = vectorstore.similarity_search(question, k=k)
    return [doc.page_content for doc in docs]
