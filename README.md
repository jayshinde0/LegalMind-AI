# 🧑‍⚖️ LegalMind AI

> A production-grade RAG (Retrieval-Augmented Generation) system for intelligent legal document analysis with zero hallucinations.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

LegalMind AI is an intelligent document assistant that helps professionals analyze legal documents instantly. Built with a RAG architecture, it combines semantic search with AI generation to provide accurate, cited answers without hallucinations.

### The Problem
- Reading 50-page legal contracts takes hours
- Traditional LLMs hallucinate legal information
- Keyword search misses semantic context
- No way to verify AI-generated answers

### The Solution
LegalMind AI uses Retrieval-Augmented Generation to:
- ✅ Process legal PDFs in seconds
- ✅ Answer questions with exact citations
- ✅ Search by meaning, not just keywords
- ✅ Prevent hallucinations through grounded responses
- ✅ Provide verifiable source references

## ✨ Features

### Core Functionality
- 📄 **PDF Upload & Processing** - Drag-and-drop interface for legal documents
- 🔍 **Semantic Search** - Find information by meaning, not just keywords
- 💬 **AI-Powered Q&A** - Ask questions in natural language
- 📚 **Citation Tracking** - Every answer includes source references
- ✅ **Zero Hallucinations** - Answers only from document content
- 🎯 **Multi-Document Support** - Query across multiple documents
- 📊 **Document Management** - View, delete, and organize documents

### Technical Features
- 🚀 **Fast Processing** - 50-page documents processed in ~20 seconds
- 💰 **100% Free AI Stack** - No paid API costs
- 🔒 **Local Embeddings** - Privacy-focused, runs on your server
- 📈 **Scalable Architecture** - Service layer pattern, easy to extend
- 🛡️ **Error Handling** - Comprehensive validation and error recovery
- 🎨 **Responsive UI** - Works on desktop, tablet, and mobile

## 🎬 Demo

### Upload a Document
```
1. Drag & drop PDF or click to upload
2. System processes document (10-20 seconds)
3. Document appears in list, ready for queries
```

### Ask Questions
```
User: "What is the salary mentioned in the contract?"

LegalMind AI: "The employee's annual base salary is $120,000 
(One Hundred Twenty Thousand Dollars), payable in bi-weekly 
installments of $4,615.38."

Citation: [Clause 2.1, employment_agreement.pdf]
```

### View Sources
```
Click on citation → See exact text from original document
Verify accuracy → Trust the answer
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Vite** - Build tool & dev server
- **Fetch API** - HTTP requests

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **LangChain** - AI orchestration
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction

### AI/ML
- **LLM**: Google Gemini 2.5 Flash Lite (text generation)
- **Embeddings**: HuggingFace all-MiniLM-L6-v2 (384-dim, local)
- **Vector DB**: FAISS (similarity search)
- **Database**: MongoDB (metadata storage)

### Architecture
- **Pattern**: RAG (Retrieval-Augmented Generation)
- **Design**: Service Layer Pattern, MVC
- **API**: RESTful

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER (Browser)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (React + Tailwind)                 │
│  • File Upload Component                                 │
│  • Chat Interface                                        │
│  • Citation Display                                      │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
                     ↓
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Document Processing Pipeline                    │   │
│  │  PDF → Text → Chunks → Embeddings → FAISS       │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Query Processing Pipeline                       │   │
│  │  Query → Embedding → Search → LLM → Answer      │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
┌──────────────────┐    ┌──────────────────┐
│   MONGODB        │    │   FAISS          │
│   (Metadata)     │    │   (Vectors)      │
└──────────────────┘    └──────────────────┘
```

### RAG Pipeline

**Document Ingestion:**
```
PDF Upload → Text Extraction → Chunking (500 tokens) → 
Embedding Generation (384-dim) → FAISS Indexing → MongoDB Metadata
```

**Query Processing:**
```
User Query → Query Embedding → Similarity Search (FAISS) → 
Retrieve Top-K Chunks → LLM Generation → Cited Answer
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 6.0+ ([MongoDB Atlas](https://www.mongodb.com/atlas) - Free)
- **Google Gemini API Key** ([Get Free Key](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jayshinde0/LegalMind-AI.git
cd LegalMind-AI
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

Create `backend/.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# AI Provider
AI_PROVIDER=gemini

# MongoDB (Get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legalmind

# Google Gemini API (Get from https://makersuite.google.com/app/apikey)
GOOGLE_API_KEY=your_api_key_here

# Models
LLM_MODEL=gemini-2.5-flash-lite
EMBEDDING_MODEL=text-embedding-004

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf

# RAG Configuration
CHUNK_SIZE=500
CHUNK_OVERLAP=50
TOP_K_RESULTS=5

# Storage
UPLOAD_DIR=./uploads
VECTORSTORE_DIR=./vectorstore
```

5. **Start the backend server**
```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

6. **Start the frontend (in a new terminal)**
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3001`

7. **Open your browser**
```
http://localhost:3001
```

## 📖 Usage

### 1. Upload a Document

- Click "Upload Document" or drag & drop a PDF
- Supported: Legal contracts, agreements, policies
- Max size: 10MB
- Processing time: ~10-20 seconds for 50-page document

### 2. Ask Questions

**Example Questions:**
```
- "What is the salary mentioned in this contract?"
- "What are the termination conditions?"
- "Can I work remotely according to this agreement?"
- "What is the non-compete period?"
- "Calculate my total compensation including benefits"
```

### 3. View Citations

- Every answer includes source citations
- Click citation to see original text
- Verify accuracy against source document

### 4. Manage Documents

- View all uploaded documents
- Delete documents you no longer need
- Upload multiple documents for cross-document queries

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Upload Document
```http
POST /documents/upload
Content-Type: multipart/form-data

Body:
  document: <file> (PDF)

Response:
{
  "success": true,
  "document": {
    "_id": "...",
    "filename": "employment_agreement.pdf",
    "status": "processing",
    "uploadDate": "2024-02-07T..."
  }
}
```

#### Get All Documents
```http
GET /documents

Response:
{
  "success": true,
  "documents": [
    {
      "_id": "...",
      "filename": "employment_agreement.pdf",
      "status": "completed",
      "chunkCount": 45,
      "uploadDate": "2024-02-07T..."
    }
  ]
}
```

#### Delete Document
```http
DELETE /documents/:id

Response:
{
  "success": true,
  "message": "Document deleted successfully"
}
```

#### Query Documents
```http
POST /query
Content-Type: application/json

Body:
{
  "query": "What is the salary?"
}

Response:
{
  "success": true,
  "answer": "The employee's annual base salary is $120,000...",
  "sources": [
    {
      "document": "employment_agreement.pdf",
      "chunkId": 5,
      "clauseNumber": "2.1",
      "excerpt": "The Employee shall receive..."
    }
  ],
  "hasAnswer": true,
  "retrievedChunks": 5
}
```

#### Health Check
```http
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2024-02-07T..."
}
```

## 📁 Project Structure

```
LegalMind-AI/
├── frontend/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx           # Main app container
│   │   │   ├── FileUpload.jsx    # PDF upload component
│   │   │   ├── ChatInterface.jsx # Q&A interface
│   │   │   ├── MessageBubble.jsx # Message display
│   │   │   └── CitationCard.jsx  # Source citations
│   │   ├── services/
│   │   │   └── api.service.js    # API calls
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/                       # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # MongoDB connection
│   │   │   ├── llm.config.js     # AI model setup
│   │   │   └── constants.js      # App constants
│   │   ├── controllers/
│   │   │   ├── document.controller.js
│   │   │   └── query.controller.js
│   │   ├── middleware/
│   │   │   ├── error.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/
│   │   │   └── Document.model.js # MongoDB schema
│   │   ├── routes/
│   │   │   ├── document.routes.js
│   │   │   └── query.routes.js
│   │   ├── services/
│   │   │   ├── pdf.service.js    # PDF parsing
│   │   │   ├── chunking.service.js
│   │   │   ├── vectorstore.service.js
│   │   │   ├── retrieval.service.js
│   │   │   └── llm.service.js
│   │   ├── utils/
│   │   │   └── prompts.js        # Prompt templates
│   │   └── server.js             # Express server
│   ├── uploads/                  # Uploaded PDFs
│   ├── vectorstore/              # FAISS index
│   ├── .env                      # Environment variables
│   └── package.json
│
├── README.md                     # This file
├── ARCHITECTURE.md               # Architecture details
├── API_DOCUMENTATION.md          # API reference
├── SETUP_GUIDE.md                # Setup instructions
└── .gitignore
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend server port | 5000 | No |
| `NODE_ENV` | Environment | development | No |
| `AI_PROVIDER` | AI provider (gemini/openai) | gemini | Yes |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `GOOGLE_API_KEY` | Google Gemini API key | - | Yes |
| `LLM_MODEL` | LLM model name | gemini-2.5-flash-lite | No |
| `EMBEDDING_MODEL` | Embedding model | text-embedding-004 | No |
| `MAX_FILE_SIZE` | Max upload size (bytes) | 10485760 | No |
| `CHUNK_SIZE` | Text chunk size (tokens) | 500 | No |
| `CHUNK_OVERLAP` | Chunk overlap (tokens) | 50 | No |
| `TOP_K_RESULTS` | Number of results to retrieve | 5 | No |

### Model Configuration

**LLM Options:**
- `gemini-2.5-flash-lite` (Recommended - Free, fast)
- `gemini-2.0-flash` (Free, more capable)
- `gpt-4` (Paid, requires OpenAI API key)

**Embedding Options:**
- `HuggingFace all-MiniLM-L6-v2` (Current - Free, local, 384-dim)
- `text-embedding-3-small` (Paid, requires OpenAI API key, 1536-dim)

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

3. **Set environment variable**
```
VITE_API_URL=https://your-backend-url.com
```

### Backend Deployment (Railway/Heroku/DigitalOcean)

1. **Prepare for production**
```bash
cd backend
npm install --production
```

2. **Set environment variables** on your hosting platform

3. **Deploy**
```bash
# Railway
railway up

# Heroku
git push heroku main

# DigitalOcean
# Use App Platform or Droplet
```

### Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster (M0 Sandbox)
3. Get connection string
4. Add to `MONGODB_URI` environment variable

### Important Notes

- FAISS index is stored locally - ensure persistent storage
- HuggingFace model downloads on first run (~80MB)
- Set `NODE_ENV=production` in production
- Use process manager (PM2) for Node.js in production

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) - AI orchestration framework
- [Google Gemini](https://ai.google.dev/) - LLM provider
- [HuggingFace](https://huggingface.co/) - Embedding models
- [FAISS](https://github.com/facebookresearch/faiss) - Vector similarity search
- [MongoDB](https://www.mongodb.com/) - Database

## 📞 Contact

**Developer**: Jay Shinde  
**GitHub**: [@jayshinde0](https://github.com/jayshinde0)  
**Project Link**: [https://github.com/jayshinde0/LegalMind-AI](https://github.com/jayshinde0/LegalMind-AI)


---
