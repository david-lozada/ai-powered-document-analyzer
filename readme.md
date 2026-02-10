# AI-Powered Document Analyzer

The **AI-Powered Document Analyzer** is a sophisticated full-stack application designed to transform static PDF documents into interactive, searchable, and intelligent knowledge bases. By leveraging **Retrieval-Augmented Generation (RAG)**, it allows users to upload documents, perform semantic searches, and chat with their content using advanced AI models.

## 🚀 Key Features

- **Intelligent Document Processing**:
  - **Advanced PDF Parsing**: robust extraction of text from complex PDFs, including handling of encrypted files and custom page rendering for optimal text stream quality.
  - **Semantic Chunking**: Intelligent splitting of text into meaningful segments based on sentence boundaries and token limits, ensuring high-quality context for the AI.
  - **Batch Processing**: Efficiently handles large documents by processing embeddings in batches, preventing API rate limits and ensuring server stability.

- **Semantic Search Engine**:
  - **Vector Embeddings**: Uses **Google Gemini** models to convert text chunks into high-dimensional vectors.
  - **pgvector Integration**: Stores and queries vectors in **PostgreSQL**, enabling lightning-fast similarity searches to find the exact paragraphs relevant to your query.

- **AI-Powered Analysis**:
  - **Cognitive Mode**: Ask natural language questions about your document. The system retrieves the most relevant context and synthesizes a precise answer using Generative AI.
  - **Smart Feedback**: Integrated error handling for API rate limits (backoff/retry strategies) and responsive UI feedback.

- **Modern User Experience**:
  - **Premium UI**: Built with a "Glassmorphism" design aesthetic, featuring smooth animations, gradient text, and interactive elements.
  - **Responsive Design**: Fully optimized for desktop and mobile devices.
  - **Real-time Feedback**: Loading states, progress indicators, and interactive error handling.

## 🏗️ Architecture & Workflow

The application follows a modern **RAG (Retrieval-Augmented Generation)** architecture:

1.  **Upload & Ingestion**:
    - User uploads a PDF via the Next.js frontend.
    - The NestJS backend receives the file and uses `pdf-parse` with custom rendering logic to extract clean text.
    - The text is cleaned (whitespace normalization, letter merging) and split into semantic chunks.

2.  **Embedding & Storage**:
    - Each text chunk is sent to the **Gemini Embedding API** to generate a vector representation.
    - Chunks and their vectors are stored in a **PostgreSQL** database equipped with the `pgvector` extension.

3.  **Retrieval & Generation**:
    - **Search**: When a user asks a question, their query is converted into a vector. The database performs a cosine similarity search to find the most relevant document chunks.
    - **Generation**: These relevant chunks are fed into the **Gemini 1.5 Pro** model as context, allowing it to generate an accurate, grounded response.

## 🛠️ Technology Stack

### Frontend

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom animations and glassmorphism utilities.
- **State Management**: React Hooks

### Backend

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database ORM**: [TypeORM](https://typeorm.io/)
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
- **Processing**: `pdf-parse`, `natural` (tokenization)

### Infrastructure & Data

- **Database**: PostgreSQL with `pgvector` extension
- **Vector Search**: HNSW (Hierarchical Navigable Small World) indexing for performance.
- **Containerization**: Docker & Docker Compose

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (or npm/yarn)
- Docker Desktop (for the database)
- A Google Gemini API Key

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/david-lozada/ai-powered-document-analyzer.git
    cd ai-powered-document-analyzer
    ```

2.  **Install Dependencies**:
    - Backend:
      ```bash
      cd api
      pnpm install
      ```
    - Frontend:
      ```bash
      cd ../cli
      pnpm install
      ```

3.  **Environment Setup**:
    - Create a `.env` file in the `api` directory:
      ```env
      DB_HOST=localhost
      DB_PORT=5432
      DB_USERNAME=postgres
      DB_PASSWORD=postgres
      DB_DATABASE=document_analyzer
      AI_API_KEY=your_gemini_api_key_here
      AI_MODEL=gemini-1.5-pro
      ```

4.  **Run the Application**:
    - **Backend (API)**:
      ```bash
      cd api
      pnpm start:dev
      ```
    - **Frontend (CLI)**:
      ```bash
      cd cli
      pnpm dev
      ```

5.  **Access the App**:
    Open [http://localhost:3001](http://localhost:3001) in your browser. (Note: Port may vary based on your Next.js config, default is usually 3000 or 3001 if API is on 3000).

## 📚 API Endpoints

- `POST /document/process`: Upload and process a PDF file.
- `POST /document/:id/search`: Perform a semantic search on a specific document.
- `POST /document/:id/analyze`: Generate an AI analysis of the document based on a query.
- `GET /document/documents/:skip/:take`: Retrieve a paginated list of uploaded documents.
- `DELETE /document/:id`: Delete a document and its embeddings.

---

_Built with ❤️ by David Lozada_
