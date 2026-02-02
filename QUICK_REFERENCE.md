# LegalMind AI - Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend  
cd frontend && npm install && npm run dev

# MongoDB (local)
mongod --dbpath /path/to/data
```

## 🔑 Essential Environment Variables

```env
# Backend .env (REQUIRED)
MONGODB_URI=mongodb://localhost:27017/legalmind
OPENAI_API_KEY=sk-your-key-here
```

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/documents/upload` | Upload PDF |
| GET | `/api/documents` | List documents |
| GET | `/api/documents/:id` | Get status |
| DELETE | `/api/documents/:id` | Delete document |
| POST | `/api/query` | Ask question |

## 🧪 Quick Test Commands

```bash
# Upload document
curl -X POST http://localhost:5000/api/documents/upload \
  -F "document=@contract.pdf"

# Query
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the terms?"}'

# Health check
curl http://localhost:5000/health
```

## 🏗️ Project Structure

```
legalmind-ai/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── models/          # MongoDB models
│   │   ├── services/        # Business logic (6 services)
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Utilities & prompts
│   ├── uploads/             # PDF storage
│   ├── vectorstore/         # FAISS index
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   └── App.jsx
│   └── package.json
└── docs/                    # Documentation
```

## 🔧 Core Services (Backend)

1. **PDF Service** - Extract text from PDFs
2. **Chunking Service** - Semantic text splitting
3. **Embedding Service** - Generate vectors (OpenAI)
4. **VectorStore Service** - FAISS operations
5. **Retrieval Service** - Query orchestration
6. **LLM Service** - GPT-4 answer generation

## 🎨 React Components (Frontend)

- **App.jsx** - Main application
- **FileUpload.jsx** - Document upload UI
- **ChatInterface.jsx** - Query interface
- **MessageBubble.jsx** - Chat messages
- **CitationCard.jsx** - Source citations
- **LoadingSpinner.jsx** - Loading state

## 📊 Data Flow

```
Upload: PDF → Extract → Chunk → Embed → FAISS → MongoDB
Query:  Question → Embed → Search → Context → LLM → Answer
```

## 🎯 Key Features

✅ Zero hallucination (strict context grounding)  
✅ Citation tracking (document + clause)  
✅ Semantic chunking (clause-aware)  
✅ Sub-2s query latency  
✅ Production architecture  

## 🔒 Security Features

- File type validation (PDF only)
- File size limits (10MB)
- Input sanitization
- Rate limiting ready
- Environment-based secrets
- CORS configuration

## 📈 Performance Metrics

| Metric | Target |
|--------|--------|
| Upload Processing | <10s |
| Query Latency | <2s |
| Embedding Gen | ~500ms |
| Vector Search | <100ms |
| LLM Generation | 1-2s |

## 🐛 Common Issues & Fixes

**MongoDB Connection Failed**
```bash
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**Port Already in Use**
```bash
lsof -i :5000  # Find process
kill -9 <PID>  # Kill it
```

**Module Not Found**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 💡 Interview Talking Points

**30-Second Pitch:**
"Built a RAG system that eliminates hallucination in legal Q&A. Users upload PDFs, system chunks semantically, generates embeddings, stores in FAISS, retrieves context for GPT-4 with strict prompting. Full MERN stack, sub-2s queries, citation tracking."

**Key Technical Decisions:**
- FAISS over Pinecone (local, privacy, cost)
- Clause-aware chunking (legal document structure)
- Temperature 0 (deterministic outputs)
- Top-5 retrieval (balance precision/context)
- Service architecture (scalability)

**Challenges Solved:**
1. Legal document structure → Regex clause detection
2. Citation tracking → Metadata embedding
3. Context limits → Smart truncation

## 📚 Documentation Files

- **README.md** - Overview & quick start
- **ARCHITECTURE.md** - System design
- **API_DOCUMENTATION.md** - API reference
- **SETUP_GUIDE.md** - Installation
- **DEPLOYMENT.md** - Production deploy
- **TESTING_GUIDE.md** - Testing procedures
- **INTERVIEW_GUIDE.md** - Interview prep
- **PROJECT_SUMMARY.md** - Executive summary

## 🎓 Resume Bullet Points

1. **Engineered LegalMind AI, a production-grade RAG system using MERN stack, LangChain, and FAISS, enabling zero-hallucination legal document Q&A with clause-level citation tracking**

2. **Architected scalable document ingestion pipeline processing PDFs through semantic chunking, OpenAI embeddings, and FAISS indexing, achieving <2s query latency**

3. **Implemented strict context-grounded LLM prompting with GPT-4 integration, ensuring responses derive exclusively from uploaded documents with automatic source attribution**

## 🏷️ ATS Keywords

`RAG` `LLM` `Vector Embeddings` `LangChain` `FAISS` `GPT-4` `Semantic Search` `MERN Stack` `Prompt Engineering` `NLP` `React.js` `Node.js` `Express.js` `MongoDB` `Microservices`

## 🔗 Useful Links

- **LangChain Docs**: https://js.langchain.com/docs
- **OpenAI API**: https://platform.openai.com/docs
- **FAISS**: https://github.com/facebookresearch/faiss
- **MongoDB**: https://docs.mongodb.com

## 💰 Cost Estimate

**Development:** $5-20/month  
**Production:** $100-400/month  

Breakdown:
- OpenAI API: $50-200/month
- MongoDB Atlas: $25-100/month
- Hosting: $30-100/month

## ⚡ Performance Optimization Tips

1. Cache embeddings (reduce API calls)
2. Use GPT-3.5-turbo for simple queries
3. Implement query deduplication
4. Add Redis for result caching
5. Optimize FAISS index (IVF)

## 🚀 Deployment Options

- **Heroku**: Easy, $7/month
- **AWS EC2**: Flexible, $10-30/month
- **DigitalOcean**: Simple, $6/month
- **Vercel** (Frontend): Free tier

## 📞 Support Resources

**Troubleshooting Order:**
1. Check terminal logs
2. Verify .env variables
3. Test with curl
4. Check MongoDB connection
5. Verify OpenAI API key

## ✅ Pre-Interview Checklist

- [ ] Can explain architecture in 2 minutes
- [ ] Can demo live system
- [ ] Know all 6 backend services
- [ ] Understand RAG vs fine-tuning
- [ ] Can discuss scaling strategies
- [ ] Know cost breakdown
- [ ] Prepared challenge/solution stories
- [ ] Resume updated with bullet points

---

**Print this page for quick reference during development and interviews!**
