from fastapi import FastAPI, UploadFile, HTTPException
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
from rag import rag_engine

# Load env vars
load_dotenv()

app = FastAPI(title="LockhartGPT Knowledge Base")

class SearchRequest(BaseModel):
    query: str
    limit: int = 5

class SearchResponse(BaseModel):
    results: List[str]

@app.get("/")
def health_check():
    return {"status": "ok", "service": "LockhartGPT Vector RAG"}

@app.post("/ingest")
async def ingest_document(file: UploadFile):
    # Save temp file
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    try:
        # Pass to RAG Engine
        num_chunks = await rag_engine.ingest_file(temp_filename, file.filename)
        
        # Cleanup
        os.remove(temp_filename)
        
        return {
            "filename": file.filename, 
            "status": "success", 
            "chunks_added": num_chunks
        }
    except Exception as e:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search", response_model=SearchResponse)
async def search_knowledge_base(request: SearchRequest):
    results = await rag_engine.search(request.query, k=request.limit)
    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8002))
    uvicorn.run(app, host="0.0.0.0", port=port)
