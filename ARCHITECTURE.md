# LegalMind AI - System Architecture

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                         │
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │  FileUpload    │  │ ChatInterface  │  │  CitationCard    │  │
│  │  Component     │  │  Component     │  │  Component       │  │
│  └────────────────┘  └────────────────┘  └──────────────────┘  │
│                                                                   │
│                    React.js + Tailwind CSS                        │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
                          │ REST API (HTTP/JSON)
                          │
┌─────────────────────────▼─────────────────────────────────────────┐
│                       APPLICATION LAYER                            │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Express.js API Gateway                       │   │
│  │  - Route Handling                                         │   │
│  │  - Request Validation                                     │   │
│  │  - Error Handling                                         │   │
│  │  - File Upload Middleware                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌──────────────────────┐  ┌──────────────────────────────┐     │
│  │  Document Controller │  │    Query Controller          │     │
│  └──────────────────────┘  └──────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────┘
                          │
                          │
┌─────────────────────────▼─────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                          │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ PDF Service  │  │   Chunking   │  │  Embedding Service   │   │
│  │              │  │   Service    │  │                      │   │
│  │ - Extract    │  │ - Semantic   │  │ - OpenAI Embeddings │   │
│  │ - Clean      │  │   Splitting  │  │ - Vector Generation │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ VectorStore  │  │  Retrieval   │  │    LLM Service       │   │
│  │  Service     │  │   Service    │  │                      │   │
│  │ - FAISS Ops  │  │ - Query      │  │ - GPT-4 Integration │   │
│  │ - Similarity │  │ - Context    │  │ - Prompt Engineering │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
                          │
                          │
┌─────────────────────────▼─────────────────────────────────────────┐
│                      DATA PERSISTENCE LAYER                        │
│                                                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │    MongoDB       │  │   FAISS Index    │  │ File System  │   │
│  │                  │  │                  │  │              │   │
│  │ - Documents      │  │ - Vector Store   │  │ - PDF Files  │   │
│  │ - Metadata       │  │ - Embeddings     │  │              │   │
│  │ - Status         │  │ - Metadata       │  │              │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

## Document Ingestion Pipeline

```
┌─────────────┐
│ User Upload │
│   PDF File  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  File Validation    │
│  - Type Check       │
│  - Size Check       │
│  - Security Check   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Save to MongoDB    │
│  Status: Processing │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  PDF Text Extract   │
│  (pdf-parse)        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Text Cleaning      │
│  - Remove extra     │
│    whitespace       │
│  - Normalize format │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Semantic Chunking  │
│  - Clause detection │
│  - Token-based split│
│  - Overlap handling │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Generate Embeddings │
│ (OpenAI API)        │
│ text-embedding-3    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Store in FAISS     │
│  - Add vectors      │
│  - Add metadata     │
│  - Save index       │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Update MongoDB     │
│  Status: Completed  │
│  Chunks: N          │
└─────────────────────┘
```

## Query Processing Flow

```
┌─────────────────┐
│  User Question  │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Input Validation   │
│  - Length check     │
│  - Sanitization     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Query Embedding    │
│  (OpenAI API)       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  FAISS Similarity   │
│  Search             │
│  - Top K results    │
│  - Score threshold  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Context Assembly   │
│  - Format chunks    │
│  - Add metadata     │
│  - Prepare sources  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Prompt Engineering │
│  - System prompt    │
│  - Context inject   │
│  - User query       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  LLM Generation     │
│  (GPT-4)            │
│  - Grounded answer  │
│  - No hallucination │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Citation Extract   │
│  - Source docs      │
│  - Clause refs      │
│  - Excerpts         │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Response to User   │
│  - Answer           │
│  - Citations        │
│  - Metadata         │
└─────────────────────┘
```

## RAG Pipeline Details

### 1. Embedding Generation
- **Model**: OpenAI text-embedding-3-small
- **Dimension**: 1536
- **Input**: Text chunks (max 500 tokens)
- **Output**: Dense vector representations

### 2. Vector Storage (FAISS)
- **Index Type**: Flat L2 (exact search)
- **Similarity Metric**: Cosine similarity
- **Metadata**: Document name, chunk ID, clause number
- **Persistence**: Disk-based storage

### 3. Retrieval Strategy
- **Method**: Similarity search with score
- **Top K**: 5 most relevant chunks
- **Score Threshold**: Configurable
- **Re-ranking**: Optional (future enhancement)

### 4. Context Window Management
- **Max Context**: ~3000 tokens
- **Chunk Size**: 500 tokens
- **Overlap**: 50 tokens
- **Truncation**: Smart truncation if needed

### 5. Prompt Engineering
```
System Prompt:
- Role definition
- Strict grounding rules
- Citation requirements
- Hallucination prevention

User Prompt:
- Retrieved context
- Source metadata
- User question
- Output format instructions
```

## Service Layer Architecture

### PDF Service
- **Responsibility**: PDF text extraction and cleaning
- **Dependencies**: pdf-parse
- **Error Handling**: Graceful degradation

### Chunking Service
- **Responsibility**: Semantic text segmentation
- **Strategy**: Clause-aware + token-based
- **Dependencies**: LangChain TextSplitter

### Embedding Service
- **Responsibility**: Vector generation
- **Provider**: OpenAI API
- **Caching**: Future enhancement

### VectorStore Service
- **Responsibility**: FAISS operations
- **Operations**: Add, search, delete
- **Persistence**: Automatic save on update

### Retrieval Service
- **Responsibility**: Query orchestration
- **Workflow**: Embed → Search → Assemble

### LLM Service
- **Responsibility**: Answer generation
- **Provider**: OpenAI GPT-4
- **Temperature**: 0 (deterministic)

## Data Models

### Document Model (MongoDB)
```javascript
{
  _id: ObjectId,
  filename: String,
  originalName: String,
  filePath: String,
  fileSize: Number,
  totalChunks: Number,
  status: Enum['processing', 'completed', 'failed'],
  vectorStoreId: String,
  uploadedAt: Date,
  processedAt: Date,
  error: String
}
```

### Vector Metadata (FAISS)
```javascript
{
  source: String,        // Document name
  chunkId: Number,       // Sequential chunk ID
  clauseNumber: Number,  // Legal clause number
  pageContent: String    // Original text
}
```

## Security Considerations

1. **File Upload**
   - Type validation (PDF only)
   - Size limits (10MB)
   - Virus scanning (future)

2. **Input Sanitization**
   - Query length limits
   - Special character handling
   - SQL injection prevention

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Environment variables for secrets

4. **Data Privacy**
   - No data logging
   - Secure file storage
   - API key protection

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API design
   - Load balancer ready
   - Session management

2. **Database Optimization**
   - MongoDB indexing
   - Connection pooling
   - Query optimization

3. **Vector Store Optimization**
   - FAISS index optimization
   - Batch operations
   - Distributed search (future)

4. **Caching Strategy**
   - Embedding cache
   - Query result cache
   - Document metadata cache

## Performance Metrics

- **Upload Processing**: ~5-10s per document
- **Query Latency**: <2s end-to-end
- **Embedding Generation**: ~500ms per chunk
- **Vector Search**: <100ms
- **LLM Generation**: ~1-2s

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js | UI components |
| Styling | Tailwind CSS | Responsive design |
| Backend | Express.js | API server |
| Database | MongoDB | Document metadata |
| Vector DB | FAISS | Similarity search |
| Embeddings | OpenAI API | Vector generation |
| LLM | GPT-4 | Answer generation |
| RAG Framework | LangChain | Pipeline orchestration |
| PDF Processing | pdf-parse | Text extraction |
