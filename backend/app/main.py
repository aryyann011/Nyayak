from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.rag.pipeline import ask_question_with_doc
from pypdf import PdfReader
import io
import os
import uvicorn
from typing import Optional, Union

app = FastAPI(title="Indian Legal AI Assistant")

# Add your production frontend URL here later
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
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
    # Union[UploadFile, str, None] prevents the 422 error from empty Swagger inputs
    file: Union[UploadFile, str, None] = File(None)
):
    uploaded_text = None

    # Only process if 'file' is actually an UploadFile object with a name
    if file and isinstance(file, UploadFile) and file.filename:
        try:
            file_bytes = await file.read()

            if file.filename.endswith(".txt"):
                uploaded_text = file_bytes.decode("utf-8")
            elif file.filename.endswith(".pdf"):
                pdf = PdfReader(io.BytesIO(file_bytes))
                # Efficiently join text to save memory
                uploaded_text = "".join([page.extract_text() or "" for page in pdf.pages])
            
            if not uploaded_text:
                return {"error": "Could not extract text from the file."}
                
        except Exception as e:
            return {"error": f"File processing failed: {str(e)}"}

    # This line triggers the AI model (The 502 "Danger Zone")
    try:
        result = ask_question_with_doc(question, uploaded_text)
        return result
    except Exception as e:
        return {"error": f"AI Pipeline failed: {str(e)}"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "10000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info")