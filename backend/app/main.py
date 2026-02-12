from fastapi import FastAPI
from pydantic import BaseModel
from app.rag.pipeline import ask_question


app = FastAPI(title="Indian Legal AI Assistant")

class Question(BaseModel):
    question: str


@app.get("/")
def root():
    return {"message": "Legal AI Assistant is running 🚀"}


@app.post("/ask")
def ask(data: Question):
    result = ask_question(data.question)
    return result
