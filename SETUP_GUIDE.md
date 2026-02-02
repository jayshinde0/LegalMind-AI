# LegalMind AI - Complete Setup Guide

## Quick Start (5 Minutes)

### Prerequisites Check
```bash
node --version  # Should be 18+
npm --version   # Should be 9+
mongod --version # Should be 6+
```

### 1. Clone and Install

```bash
# Clone repository
git clone <your-repo-url>
cd legalmind-ai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Environment

```bash
# Backend environment
cd backend
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-...
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod --dbpath /path/to/data
```

**Option B: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`

### 4. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Test It Out

1. Open http://localhost:3000
2. Upload a sample PDF
3. Wait for processing (~10 seconds)
4. Ask a question!

---

## Detailed Setup Instructions

### Step 1: System Requirements

**Minimum Requirements:**
- Node.js 18.0+
- npm 9.0+
- MongoDB 6.0+
- 4GB RAM
- 2GB free disk space

**Recommended:**
- Node.js 20.0+
- 8GB RAM
- SSD storage

### Step 2: Install Node.js

**Windows:**
1. Download from https://nodejs.org
2. Run installer
3. Verify: `node --version`

**macOS:**
```bash
brew install node@18
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Install MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. Start MongoDB service

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Verify MongoDB:**
```bash
mongosh
# Should connect successfully
```

### Step 4: Get OpenAI API Key

1. Go to https://platform.openai.com
2. Sign up / Log in
3. Navigate to API Keys section
4. Create new secret key
5. Copy the key (starts with `sk-`)
6. **Important:** Add payment method to avoid rate limits

**Cost Estimate:**
- Embeddings: ~$0.0001 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens
- Expected: $5-20/month for development

### Step 5: Project Setup

```bash
# Create project directory
mkdir legalmind-ai
cd legalmind-ai

# Initialize git (optional)
git init
```

### Step 6: Backend Setup

```bash
# Create backend directory
mkdir backend
cd backend

# Copy package.json (from project files)
# Then install
npm install

# Create directory structure
mkdir -p src/config src/models src/services src/controllers src/routes src/middleware src/utils
mkdir uploads vectorstore

# Copy all backend files from project

# Setup environment
cp .env.example .env
nano .env  # or use your preferred editor
```

**Configure .env:**
```env
PORT=5000
NODE_ENV=development

# MongoDB - Choose one:
# Local:
MONGODB_URI=mongodb://localhost:27017/legalmind
# Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legalmind

# OpenAI
OPENAI_API_KEY=sk-your-actual-key-here
LLM_MODEL=gpt-4
EMBEDDING_MODEL=text-embedding-3-small

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf

# RAG Configuration
CHUNK_SIZE=500
CHUNK_OVERLAP=50
TOP_K_RESULTS=5

# Paths
UPLOAD_DIR=./uploads
VECTORSTORE_DIR=./vectorstore
```

**Test Backend:**
```bash
npm run dev

# Should see:
# MongoDB Connected: ...
# Application initialized successfully
# Server running on port 5000
```

### Step 7: Frontend Setup

```bash
# From project root
cd frontend

# Copy package.json (from project files)
# Then install
npm install

# Copy all frontend files from project

# Create .env (optional)
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

**Test Frontend:**
```bash
npm run dev

# Should see:
# VITE v5.x.x ready in xxx ms
# ➜ Local: http://localhost:3000
```

### Step 8: Verify Installation

**Backend Health Check:**
```bash
curl http://localhost:5000/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

**Frontend Access:**
1. Open browser to http://localhost:3000
2. Should see "LegalMind AI" interface

---

## Common Issues and Solutions

### Issue 1: MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list  # macOS

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS

# Check connection string in .env
# Make sure it matches your MongoDB setup
```

### Issue 2: OpenAI API Key Invalid

**Error:** `OpenAI API error: Incorrect API key`

**Solutions:**
1. Verify key starts with `sk-`
2. Check for extra spaces in .env
3. Regenerate key on OpenAI platform
4. Ensure billing is set up

### Issue 3: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=5001
```

### Issue 4: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: CORS Error

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
Backend already has CORS enabled. If issue persists:
```javascript
// In backend/src/server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 6: PDF Upload Fails

**Error:** `PDF extraction failed`

**Solutions:**
1. Ensure PDF is not password-protected
2. Check PDF is not corrupted
3. Verify file size <10MB
4. Try different PDF

### Issue 7: FAISS Index Error

**Error:** `Failed to load FAISS index`

**Solution:**
```bash
# Delete and recreate vectorstore
cd backend
rm -rf vectorstore/*
# Restart backend - will create new index
```

---

## Development Workflow

### Daily Development

```bash
# Terminal 1: Backend with auto-reload
cd backend
npm run dev

# Terminal 2: Frontend with hot reload
cd frontend
npm run dev

# Terminal 3: MongoDB (if local)
mongod --dbpath /path/to/data

# Terminal 4: Testing/Commands
curl http://localhost:5000/api/documents
```

### Making Changes

**Backend Changes:**
- Edit files in `backend/src/`
- Server auto-restarts (nodemon)
- Check terminal for errors

**Frontend Changes:**
- Edit files in `frontend/src/`
- Browser auto-refreshes
- Check browser console for errors

### Testing Changes

```bash
# Test API endpoint
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test query"}'

# Check logs
# Backend: Terminal 1
# Frontend: Browser DevTools Console
```

---

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB (Atlas recommended)
- [ ] Secure OpenAI API key (environment variable)
- [ ] Enable HTTPS/SSL
- [ ] Set up domain name
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, New Relic)
- [ ] Configure backups (MongoDB, vectorstore)
- [ ] Set up CI/CD pipeline
- [ ] Load testing
- [ ] Security audit
- [ ] Documentation review

---

## Useful Commands

### Backend

```bash
# Start development server
npm run dev

# Start production server
npm start

# Check for errors
npm run lint  # (if configured)

# View logs
tail -f logs/combined.log  # (if logging configured)
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run build -- --analyze
```

### MongoDB

```bash
# Connect to database
mongosh

# Show databases
show dbs

# Use legalmind database
use legalmind

# Show collections
show collections

# Query documents
db.documents.find().pretty()

# Count documents
db.documents.countDocuments()

# Delete all documents (careful!)
db.documents.deleteMany({})
```

### Git

```bash
# Initial commit
git add .
git commit -m "Initial commit: LegalMind AI RAG system"

# Create repository on GitHub
# Then push
git remote add origin <your-repo-url>
git push -u origin main
```

---

## Environment Variables Reference

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Server port |
| NODE_ENV | No | development | Environment |
| MONGODB_URI | Yes | - | MongoDB connection string |
| OPENAI_API_KEY | Yes | - | OpenAI API key |
| LLM_MODEL | No | gpt-4 | LLM model name |
| EMBEDDING_MODEL | No | text-embedding-3-small | Embedding model |
| MAX_FILE_SIZE | No | 10485760 | Max upload size (bytes) |
| CHUNK_SIZE | No | 500 | Text chunk size (tokens) |
| CHUNK_OVERLAP | No | 50 | Chunk overlap (tokens) |
| TOP_K_RESULTS | No | 5 | Number of results to retrieve |
| UPLOAD_DIR | No | ./uploads | Upload directory |
| VECTORSTORE_DIR | No | ./vectorstore | Vector store directory |

### Frontend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| VITE_API_URL | No | http://localhost:5000/api | Backend API URL |

---

## Next Steps

1. **Test the System:**
   - Upload sample legal documents
   - Try various queries
   - Verify citations

2. **Customize:**
   - Adjust chunk size for your documents
   - Modify UI styling
   - Add features

3. **Deploy:**
   - Follow DEPLOYMENT.md
   - Set up production environment
   - Configure monitoring

4. **Learn More:**
   - Read ARCHITECTURE.md
   - Study INTERVIEW_GUIDE.md
   - Review API_DOCUMENTATION.md

---

## Getting Help

**Common Resources:**
- LangChain Docs: https://js.langchain.com/docs
- OpenAI API Docs: https://platform.openai.com/docs
- FAISS Docs: https://github.com/facebookresearch/faiss
- MongoDB Docs: https://docs.mongodb.com

**Troubleshooting:**
1. Check terminal logs for errors
2. Verify environment variables
3. Test API endpoints with curl
4. Check MongoDB connection
5. Verify OpenAI API key and billing

**Project Documentation:**
- README.md - Overview
- ARCHITECTURE.md - System design
- API_DOCUMENTATION.md - API reference
- TESTING_GUIDE.md - Testing procedures
- DEPLOYMENT.md - Deployment guide
- INTERVIEW_GUIDE.md - Interview prep
