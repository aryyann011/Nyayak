import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain_huggingface import HuggingFaceEmbeddings

# 1. Use absolute paths to prevent "File Not Found" errors
# This finds the directory where build_index.py is located
current_dir = os.path.dirname(os.path.abspath(__file__))

# Moves up one level to the 'app' folder, then into 'data/legal_docs'
DATA_PATH = os.path.join(current_dir, "..", "data", "legal_docs")
INDEX_PATH = os.path.join(current_dir, "..", "faiss_index")

def load_documents():
    """Loads all .txt files from the data directory."""
    if not os.path.exists(DATA_PATH):
        print(f"❌ Error: The directory {DATA_PATH} does not exist.")
        return []

    documents = []
    files = [f for f in os.listdir(DATA_PATH) if f.endswith(".txt")]
    
    if not files:
        print(f"⚠️ Warning: No .txt files found in {DATA_PATH}")
        return []

    for filename in files:
        try:
            loader = TextLoader(
                os.path.join(DATA_PATH, filename),
                encoding="utf-8"
            )
            # TextLoader automatically adds 'source' metadata (the filename)
            documents.extend(loader.load())
            print(f"📄 Loaded: {filename}")
        except Exception as e:
            print(f"❌ Failed to load {filename}: {e}")
            
    return documents

def build_index():
    # 3. Check if index already exists
    if os.path.exists(INDEX_PATH):
        print("⚠️ FAISS index already exists. Rebuilding will overwrite the old one.")

    print("\n🔹 Step 1: Loading documents...")
    documents = load_documents()
    if not documents:
        print("🛑 Aborting: No documents to index.")
        return

    print(f"🔹 Step 2: Splitting {len(documents)} documents into chunks...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100
    )
    texts = splitter.split_documents(documents)
    print(f"✅ Created {len(texts)} text chunks.")

    print("🔹 Step 3: Loading embedding model (all-MiniLM-L6-v2)...")
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    print("🔹 Step 4: Creating FAISS vector store...")
    vectorstore = FAISS.from_documents(texts, embeddings)

    print(f"🔹 Step 5: Saving index to {INDEX_PATH}...")
    os.makedirs(INDEX_PATH, exist_ok=True)  
    vectorstore.save_local(INDEX_PATH)

    print("\n✅ FAISS index created successfully!")
    print("🚀 You can now use pipeline.py to query your legal documents.")

if __name__ == "__main__":
    build_index()