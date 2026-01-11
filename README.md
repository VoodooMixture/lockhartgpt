# LockhartGPT

An interactive AI portfolio that blends a chat interface with an IDE-like workspace.
Built with Next.js, Tailwind, shadcn/ui, and OpenAI.

## Features

- **Split-Pane Interface**: Transitions from a landing page to a split chat/workspace view.
- **Ghost Composer**: Rotating prompt ideas in the input field.
- **Interactive Workspace**: The AI can open files and you can navigate via tabs.
- **Interview Mode**: A toggle that flips the script—the AI asks you questions.
- **Streaming Responses**: Real-time chat powered by OpenAI.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + generic dark theme tokens
- **UI Components**: shadcn/ui (Button, Card, Input, ScrollArea, Tabs, etc.)
- **Icons**: lucide-react
- **Editor**: `@monaco-editor/react`
- **State**: `zustand`
- **AI**: `openai` SDK

## Setup

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/yourusername/lockhart-gpt.git
    cd lockhart-gpt
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root:
    ```bash
    OPENAI_API_KEY=sk-your-key-here
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Architecture

- **`store/useAppStore.ts`**: Global state (chat history, workspace state, mode).
- **`app/api/chat/route.ts`**: Streaming API route that forces JSON output from the LLM.
- **`lib/actions`**: 
    - `schema.ts`: Zod definition of UI actions (open_file, update_context etc).
    - `executor.ts`: Maps actions to state updates.
- **`hooks/useProjectChat.ts`**: Custom hook that manages the chat loop and action execution.

## Customization

- **Seed Content**: Edit `lib/portfolio/content.ts` to add your own markdown files.
- **System Prompt**: Edit `lib/prompts/system.ts` to change the persona or capabilities.

## License

MIT

## The Archive (Vector RAG)

The project includes a Python backend for RAG (Retrieval Augmented Generation) on unstructured documents ("The Archive").

### Setup

1.  **Python Environment**:
    ```bash
    cd python-backend
    # Optional: Create venv
    pip install -r requirements.txt
    ```

2.  **Environment Variables** (add to `.env`):
    ```bash
    # Google Cloud (for Vertex AI Embeddings)
    GOOGLE_APPLICATION_CREDENTIALS="./python-backend/service-account.json"
    
    # Supabase (for Vector Storage)
    SUPABASE_URL="https://your-project.supabase.co"
    SUPABASE_KEY="your-anon-key"
    ```

3.  **Run the Server**:
    ```bash
    python python-backend/main.py
    # Runs on http://localhost:8002
    ```

### Supported File Types
- PDF (`.pdf`)
- Word (`.docx`, `.doc`)
- Excel (`.xlsx`, `.xls`)
- PowerPoint (`.pptx`, `.ppt`)
- Plain Text (`.txt`, `.md`, `.py`, etc.)

### Ingesting Documents
Currently, use `curl` to upload documents to the knowledge base:

```bash
# Upload a PDF
curl -X POST -F "file=@/path/to/doc.pdf" http://localhost:8002/ingest

# Upload a Spreadsheet
curl -X POST -F "file=@/path/to/sheet.xlsx" http://localhost:8002/ingest
```
