from fastapi import FastAPI
from app.deserializer import safe_deserialize
from app.crypto import safe_hash
from app.client import secure_fetch

app = FastAPI(title="Async Task Processor")

@app.get("/health")
def health_check():
    return {"status": "ok"}
