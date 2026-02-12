from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.rag.pipeline import ask_question_with_doc
from pypdf import PdfReader
import io

app = FastAPI(title="Indian Legal AI Assistant")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Legal AI Assistant is running 🚀"}


@app.post("/ask")
async def ask(
    question: str = Form(...),
    file: UploadFile = File(None)
):
    uploaded_text = None

    if file:
        file_bytes = await file.read()

        # 🔹 Handle TXT
        if file.filename.endswith(".txt"):
            uploaded_text = file_bytes.decode("utf-8")

        # 🔹 Handle PDF
        elif file.filename.endswith(".pdf"):
            pdf = PdfReader(io.BytesIO(file_bytes))
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
            uploaded_text = text

        else:
            return {
                "error": "Unsupported file format. Please upload .txt or .pdf"
            }

    result = ask_question_with_doc(question, uploaded_text)
    return result
