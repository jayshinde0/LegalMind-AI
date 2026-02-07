# 🚀 LegalMind AI - Quick Start Guide

## ✅ System Status: READY!

Both servers are running and the system is fully functional!

---

## 🌐 Access URLs

- **Frontend (Web Interface)**: http://localhost:3001
- **Backend (API)**: http://localhost:5000
- **Quick Test Page**: Open `backend/test.html` in your browser

---

## 📝 How to Use

### Step 1: Upload a PDF Document

**Option A: Web Interface (Recommended)**
1. Open http://localhost:3001 in your browser
2. Click "Upload Document" or drag & drop a PDF file
3. Wait for processing (you'll see a success message)

**Option B: Quick Test Page**
1. Open `backend/test.html` in your browser
2. Click "Choose File" and select a PDF
3. Click "Upload"

### Step 2: Ask Questions

Once a document is uploaded:
1. Type your question in the chat input
2. Press Enter or click Send
3. Get AI-generated answers with citations!

---

## 🧪 Test with Sample Questions

After uploading a legal document, try these questions:

- "What is this document about?"
- "Summarize the main points"
- "What are the key terms and conditions?"
- "Who are the parties involved?"
- "What are the obligations mentioned?"

---

## 🎯 Features Working

✅ PDF Upload & Processing
✅ Text Extraction & Chunking
✅ Vector Embeddings (HuggingFace - Local)
✅ Semantic Search (FAISS)
✅ AI Answer Generation (Google Gemini)
✅ Citation Support
✅ MongoDB Storage
✅ Clean UI with Tailwind CSS

---

## 🔧 If You Need to Restart

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

### Both (from project root)
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## 📊 Current Configuration

| Component | Technology | Status |
|-----------|-----------|--------|
| Frontend | React + Vite + Tailwind | ✅ Running |
| Backend | Node.js + Express | ✅ Running |
| Database | MongoDB Atlas | ✅ Connected |
| Vector Store | FAISS (local) | ✅ Initialized |
| Embeddings | HuggingFace (local) | ✅ Working |
| LLM | Google Gemini API | ✅ Working |

---

## 💡 Important Notes

### First Upload May Be Slow
- HuggingFace downloads the embedding model (~80MB) on first use
- This happens only once - subsequent uploads will be fast
- The model is cached locally

### Empty Vector Store
- If you query before uploading documents, you'll get an error
- This is normal - just upload a PDF first!

### PDF Files Already in System
There are already some PDF files in `backend/uploads/` folder:
- These are just stored files, not processed yet
- You need to upload them through the web interface to process them
- Or delete them if you want to start fresh

---

## 🎓 For Interviews

### Project Highlights
1. **Full-Stack RAG System**: MERN stack with LangChain
2. **100% Free AI Stack**: No paid APIs required
3. **Production Architecture**: Clean separation of concerns
4. **Citation Support**: Answers include source references
5. **Anti-Hallucination**: Strict context-based responses

### Tech Stack
- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express, LangChain
- **AI**: Google Gemini (LLM), HuggingFace (Embeddings)
- **Database**: MongoDB Atlas, FAISS
- **Architecture**: RESTful API, Service Layer Pattern

### Key Features
- PDF parsing and chunking
- Semantic search with vector embeddings
- Context-aware LLM responses
- Document metadata tracking
- Error handling and validation

---

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>

# Then restart
npm run dev
```

### "Cannot connect to MongoDB"
- Check internet connection
- Verify `.env` has correct MongoDB URI
- Check MongoDB Atlas cluster is running

### "Embeddings are slow"
- First run downloads model (~80MB)
- Subsequent runs will be fast
- Model is cached in `~/.cache/huggingface/`

### "No documents found"
- Upload a PDF through the web interface first
- Check `backend/uploads/` folder has files
- Check MongoDB has document records

---

## 📚 Additional Documentation

- **Full Architecture**: See `ARCHITECTURE.md`
- **API Documentation**: See `API_DOCUMENTATION.md`
- **Setup Guide**: See `SETUP_GUIDE.md`
- **Solution Details**: See `SOLUTION_SUMMARY.md`
- **Deployment**: See `DEPLOYMENT.md`

---

## 🎉 You're All Set!

Your LegalMind AI system is ready to use. Open http://localhost:3001 and start uploading documents!

**Need Help?**
- Check the documentation files
- Review the code comments
- Test with `backend/test.html`

**Ready for Production?**
- See `DEPLOYMENT.md` for deployment instructions
- All code is production-ready
- Environment variables are properly configured

---

## 🚀 Next Steps

1. **Test the System**: Upload a PDF and ask questions
2. **Customize**: Modify prompts in `backend/src/utils/prompts.js`
3. **Deploy**: Follow `DEPLOYMENT.md` when ready
4. **Showcase**: Add to your portfolio and resume!

**Happy Coding! 🧑‍⚖️**
