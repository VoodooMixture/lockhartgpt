import os
from typing import List
from langchain_google_vertexai import VertexAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_community.document_loaders import (
    PyPDFLoader, 
    Docx2txtLoader, 
    UnstructuredExcelLoader, 
    UnstructuredPowerPointLoader
)
from langchain_text_splitters import CharacterTextSplitter
from langchain_core.documents import Document
from supabase.client import Client, create_client

# Load env vars
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Vertex AI Embeddings
try:
    embeddings = VertexAIEmbeddings(model_name="textembedding-gecko@001")
    print("✅ Vertex AI Embeddings initialized.")
except Exception as e:
    print(f"⚠️ Failed to init Vertex AI: {e}")
    embeddings = None

# Initialize Supabase Client
supabase_client: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase Client initialized.")
    except Exception as e:
        print(f"⚠️ Failed to init Supabase: {e}")
else:
    print("⚠️ Missing SUPABASE_URL or SUPABASE_KEY. Archive will not persist.")

class RAGController:
    def __init__(self):
        self.text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        self.vector_store = None
        
        if supabase_client and embeddings:
            self.vector_store = SupabaseVectorStore(
                client=supabase_client,
                embedding=embeddings,
                table_name="documents",
                query_name="match_documents",
            )

    async def ingest_file(self, file_path: str, original_filename: str):
        if not self.vector_store:
            raise Exception("Vector Store not initialized. Check Supabase credentials.")

        ext = original_filename.lower().split('.')[-1]
        documents = []

        try:
            # 1. Load by Extension
            if ext == "pdf":
                loader = PyPDFLoader(file_path)
                documents = loader.load()
            elif ext in ["docx", "doc"]:
                loader = Docx2txtLoader(file_path)
                documents = loader.load()
            elif ext in ["xlsx", "xls"]:
                # mode="elements" gives row-by-row or granular content
                loader = UnstructuredExcelLoader(file_path, mode="elements")
                documents = loader.load()
            elif ext in ["pptx", "ppt"]:
                loader = UnstructuredPowerPointLoader(file_path)
                documents = loader.load()
            else:
                # Fallback for text files
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read()
                documents = [Document(page_content=text, metadata={"source": original_filename})]
        except Exception as e:
            print(f"Error loading {original_filename}: {e}")
            raise e

        # 2. Split
        splitted_docs = self.text_splitter.split_documents(documents)
        print(f"Divided {original_filename} into {len(splitted_docs)} chunks.")

        # 3. Embed & Store
        self.vector_store.add_documents(splitted_docs)

        return len(splitted_docs)

    async def search(self, query: str, k: int = 5) -> List[str]:
        if not self.vector_store:
            return ["Archive is offline. Check Supabase credentials."]
        
        # Similarity Search
        docs = self.vector_store.similarity_search(query, k=k)
        return [doc.page_content for doc in docs]

rag_engine = RAGController()
