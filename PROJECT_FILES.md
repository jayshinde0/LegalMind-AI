# LegalMind AI - Complete File Structure

## Project Root Files

```
legalmind-ai/
├── .gitignore                      # Git ignore patterns
├── README.md                       # Main project documentation
├── ARCHITECTURE.md                 # System architecture details
├── API_DOCUMENTATION.md            # Complete API reference
├── DEPLOYMENT.md                   # Production deployment guide
├── INTERVIEW_GUIDE.md              # Interview preparation
├── PROJECT_SUMMARY.md              # Executive summary
├── QUICK_REFERENCE.md              # Quick reference card
├── SETUP_GUIDE.md                  # Detailed setup instructions
├── TESTING_GUIDE.md                # Testing procedures
└── PROJECT_FILES.md                # This file
```

## Backend Structure

```
backend/
├── package.json                    # Dependencies and scripts
├── .env.example                    # Environment variables template
├── .env                            # Environment variables (gitignored)
│
├── uploads/                        # PDF file storage (gitignored)
│   └── .gitkeep
│
├── vectorstore/                    # FAISS index storage (gitignored)
│   └── .gitkeep
│
└── src/
    ├── server.js                   # Main application entry point
    │
    ├── config/
    │   ├── database.js             # MongoDB connection
    │   ├── llm.config.js           # LLM and embeddings config
    │   └── constants.js            # Application constants
    │
    ├── models/
    │   ├── Document.model.js       # Document MongoDB schema
    │   └── User.model.js           # User schema (future)
    │
    ├── services/
    │   ├── pdf.service.js          # PDF text extraction
    │   ├── chunking.service.js     # Text chunking logic
    │   ├── embedding.service.js    # Embedding generation (future)
    │   ├── vectorstore.service.js  # FAISS operations
    │   ├── retrieval.service.js    # Query orchestration
    │   └── llm.service.js          # LLM answer generation
    │
    ├── controllers/
    │   ├── document.controller.js  # Document upload/management
    │   └── query.controller.js     # Query processing
    │
    ├── routes/
    │   ├── document.routes.js      # Document API routes
    │   └── query.routes.js         # Query API routes
    │
    ├── middleware/
    │   ├── upload.middleware.js    # Multer file upload
    │   ├── validation.middleware.js # Input validation
    │   └── error.middleware.js     # Error handling
    │
    └── utils/
        ├── logger.js               # Logging utility (future)
        └── prompts.js              # LLM prompt templates
```

## Frontend Structure

```
frontend/
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── index.html                      # HTML entry point
│
└── src/
    ├── main.jsx                    # React entry point
    ├── App.jsx                     # Main application component
    ├── index.css                   # Global styles (Tailwind)
    │
    ├── components/
    │   ├── FileUpload.jsx          # Document upload UI
    │   ├── ChatInterface.jsx       # Query chat interface
    │   ├── MessageBubble.jsx       # Chat message display
    │   ├── CitationCard.jsx        # Source citation display
    │   └── LoadingSpinner.jsx      # Loading indicator
    │
    ├── services/
    │   └── api.service.js          # API client (Axios)
    │
    └── hooks/
        └── useChat.js              # Chat state management (future)
```

## Key Files Explained

### Backend Core Files

**server.js**
- Application initialization
- Express server setup
- MongoDB connection
- FAISS initialization
- Route registration
- Error handling

**config/llm.config.js**
- OpenAI LLM configuration
- Embedding model setup
- API key management

**services/pdf.service.js**
- PDF text extraction using pdf-parse
- Text cleaning and normalization

**services/chunking.service.js**
- Semantic text chunking
- Clause detection for legal documents
- Token-based splitting with overlap

**services/vectorstore.service.js**
- FAISS index management
- Vector addition and search
- Persistence to disk

**services/retrieval.service.js**
- Query embedding generation
- Similarity search orchestration
- Context assembly

**services/llm.service.js**
- GPT-4 integration
- Prompt engineering
- Citation extraction

**utils/prompts.js**
- System prompt for anti-hallucination
- User prompt template
- Context formatting

### Frontend Core Files

**App.jsx**
- Main application layout
- Document list management
- Notification handling
- State management

**components/FileUpload.jsx**
- File selection UI
- Upload progress tracking
- Validation (type, size)
- Error display

**components/ChatInterface.jsx**
- Message history display
- Query input handling
- Loading states
- Auto-scroll

**components/MessageBubble.jsx**
- User/assistant message rendering
- Citation display
- Timestamp formatting

**components/CitationCard.jsx**
- Source document display
- Clause reference
- Text excerpt

**services/api.service.js**
- Axios HTTP client
- API endpoint functions
- Error handling

## Configuration Files

### Backend Configuration

**.env.example**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legalmind
OPENAI_API_KEY=sk-...
LLM_MODEL=gpt-4
EMBEDDING_MODEL=text-embedding-3-small
MAX_FILE_SIZE=10485760
CHUNK_SIZE=500
CHUNK_OVERLAP=50
TOP_K_RESULTS=5
```

**package.json**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "pdf-parse": "^1.1.1",
    "langchain": "^0.1.0",
    "@langchain/openai": "^0.0.19",
    "@langchain/community": "^0.0.20",
    "faiss-node": "^0.5.1",
    "uuid": "^9.0.1"
  }
}
```

### Frontend Configuration

**vite.config.js**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

**tailwind.config.js**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#64748b',
      },
    },
  },
  plugins: [],
}
```

**package.json**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

## Documentation Files

### README.md
- Project overview
- System architecture diagram
- Tech stack
- Setup instructions
- API endpoints
- Resume bullet points
- Interview guide summary

### ARCHITECTURE.md
- High-level architecture
- Data flow diagrams
- RAG pipeline details
- Service layer architecture
- Data models
- Security considerations
- Scalability strategies
- Performance metrics

### API_DOCUMENTATION.md
- Complete API reference
- Request/response examples
- Error codes
- Rate limiting
- CORS configuration
- Postman collection
- cURL examples

### SETUP_GUIDE.md
- Prerequisites
- Step-by-step installation
- Environment configuration
- MongoDB setup
- OpenAI API key setup
- Common issues and solutions
- Development workflow

### DEPLOYMENT.md
- Local development setup
- Production deployment
- Docker configuration
- Cloud platform guides (Heroku, AWS, DigitalOcean)
- Performance optimization
- Monitoring and logging
- Security hardening
- Backup strategy

### TESTING_GUIDE.md
- Manual testing checklist
- API testing with cURL
- Automated testing examples
- Performance testing
- Test data
- CI/CD pipeline
- Quality metrics

### INTERVIEW_GUIDE.md
- Project overview pitch
- Common interview questions
- Technical deep dives
- System design questions
- Resume bullet points
- Project description
- ATS keywords

### PROJECT_SUMMARY.md
- Executive summary
- Key achievements
- Technology stack
- System architecture
- Core features
- Performance metrics
- Learning outcomes
- Resume integration

### QUICK_REFERENCE.md
- Quick start commands
- Essential environment variables
- API endpoints table
- Project structure
- Core services
- React components
- Common issues
- Interview talking points

## File Count Summary

```
Backend:
- Configuration: 3 files
- Models: 1 file (+ 1 future)
- Services: 6 files
- Controllers: 2 files
- Routes: 2 files
- Middleware: 3 files
- Utils: 1 file (+ 1 future)
Total: 18 files

Frontend:
- Root: 3 files
- Components: 5 files
- Services: 1 file
- Hooks: 0 files (+ 1 future)
Total: 9 files

Documentation:
- Root documentation: 10 files

Total Project Files: 37 core files
```

## Lines of Code Estimate

```
Backend:
- Services: ~800 lines
- Controllers: ~200 lines
- Routes: ~50 lines
- Middleware: ~150 lines
- Config: ~100 lines
- Models: ~50 lines
- Utils: ~100 lines
Total: ~1,450 lines

Frontend:
- Components: ~600 lines
- Services: ~100 lines
- App: ~100 lines
Total: ~800 lines

Documentation: ~8,000 lines

Total Project: ~10,250 lines
```

## Technology Dependencies

### Backend Dependencies (15)
1. express - Web framework
2. mongoose - MongoDB ODM
3. dotenv - Environment variables
4. cors - CORS middleware
5. multer - File upload
6. pdf-parse - PDF extraction
7. langchain - RAG framework
8. @langchain/openai - OpenAI integration
9. @langchain/community - Community integrations
10. faiss-node - Vector database
11. uuid - Unique IDs
12. express-rate-limit - Rate limiting
13. nodemon - Development (dev)

### Frontend Dependencies (7)
1. react - UI library
2. react-dom - React DOM
3. axios - HTTP client
4. vite - Build tool (dev)
5. @vitejs/plugin-react - Vite React plugin (dev)
6. tailwindcss - CSS framework (dev)
7. postcss - CSS processing (dev)
8. autoprefixer - CSS prefixing (dev)

## Git Ignore Patterns

```
# Dependencies
node_modules/
package-lock.json

# Environment
.env
.env.local

# Build
dist/
build/

# Uploads
backend/uploads/*
!backend/uploads/.gitkeep

# Vector Store
backend/vectorstore/*
!backend/vectorstore/.gitkeep

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

## Development Workflow

1. **Initial Setup**
   - Clone repository
   - Install dependencies (backend + frontend)
   - Configure environment variables
   - Start MongoDB
   - Run development servers

2. **Development**
   - Backend: `npm run dev` (auto-reload)
   - Frontend: `npm run dev` (hot reload)
   - Test with sample PDFs
   - Iterate on features

3. **Testing**
   - Manual testing with UI
   - API testing with cURL/Postman
   - Check logs for errors
   - Verify citations

4. **Deployment**
   - Build frontend: `npm run build`
   - Set production environment variables
   - Deploy to cloud platform
   - Configure monitoring

## Next Steps for Enhancement

1. **Add Testing**
   - Unit tests (Jest)
   - Integration tests (Supertest)
   - E2E tests (Cypress)

2. **Add Authentication**
   - User registration/login
   - JWT tokens
   - Protected routes

3. **Improve UI**
   - Dark mode
   - Document preview
   - Advanced search
   - Analytics dashboard

4. **Optimize Performance**
   - Redis caching
   - Query deduplication
   - Batch processing
   - CDN for frontend

5. **Add Features**
   - Document comparison
   - Export functionality
   - Multi-language support
   - Collaborative features

---

**This project structure is production-ready and interview-optimized!**
