# LegalMind AI - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## API Endpoints

### 1. Health Check

**GET** `/health`

Check if the server is running and healthy.

**Response**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Upload Document

**POST** `/documents/upload`

Upload a legal PDF document for processing.

**Headers**
```
Content-Type: multipart/form-data
```

**Request Body**
```
document: File (PDF, max 10MB)
```

**Success Response (202 Accepted)**
```json
{
  "success": true,
  "message": "Document uploaded and processing started",
  "documentId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "filename": "Employment_Contract.pdf"
}
```

**Error Responses**

400 Bad Request - Invalid file type
```json
{
  "success": false,
  "error": "Only PDF files are allowed"
}
```

400 Bad Request - File too large
```json
{
  "success": false,
  "error": "File size exceeds the limit of 10MB"
}
```

**Example (cURL)**
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "document=@/path/to/contract.pdf"
```

**Example (JavaScript)**
```javascript
const formData = new FormData();
formData.append('document', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/documents/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
```

---

### 3. Get All Documents

**GET** `/documents`

Retrieve list of all uploaded documents with their processing status.

**Success Response (200 OK)**
```json
{
  "success": true,
  "count": 3,
  "documents": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "filename": "abc123.pdf",
      "originalName": "Employment_Contract.pdf",
      "fileSize": 245678,
      "totalChunks": 45,
      "status": "completed",
      "uploadedAt": "2024-01-15T10:00:00.000Z",
      "processedAt": "2024-01-15T10:00:15.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "filename": "def456.pdf",
      "originalName": "NDA_Agreement.pdf",
      "fileSize": 189234,
      "totalChunks": 32,
      "status": "processing",
      "uploadedAt": "2024-01-15T10:05:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "filename": "ghi789.pdf",
      "originalName": "Service_Agreement.pdf",
      "fileSize": 312456,
      "totalChunks": 0,
      "status": "failed",
      "uploadedAt": "2024-01-15T10:10:00.000Z",
      "error": "PDF extraction failed: Invalid PDF structure"
    }
  ]
}
```

**Example (cURL)**
```bash
curl http://localhost:5000/api/documents
```

---

### 4. Get Document Status

**GET** `/documents/:id`

Get detailed status of a specific document.

**URL Parameters**
- `id` (string, required): Document ID

**Success Response (200 OK)**
```json
{
  "success": true,
  "document": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "filename": "abc123.pdf",
    "originalName": "Employment_Contract.pdf",
    "fileSize": 245678,
    "totalChunks": 45,
    "status": "completed",
    "uploadedAt": "2024-01-15T10:00:00.000Z",
    "processedAt": "2024-01-15T10:00:15.000Z"
  }
}
```

**Error Response (404 Not Found)**
```json
{
  "success": false,
  "error": "Document not found"
}
```

**Example (cURL)**
```bash
curl http://localhost:5000/api/documents/65a1b2c3d4e5f6g7h8i9j0k1
```

---

### 5. Delete Document

**DELETE** `/documents/:id`

Delete a document and remove its vectors from the database.

**URL Parameters**
- `id` (string, required): Document ID

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Error Response (404 Not Found)**
```json
{
  "success": false,
  "error": "Document not found"
}
```

**Example (cURL)**
```bash
curl -X DELETE http://localhost:5000/api/documents/65a1b2c3d4e5f6g7h8i9j0k1
```

---

### 6. Query Documents

**POST** `/query`

Ask a question based on uploaded legal documents.

**Headers**
```
Content-Type: application/json
```

**Request Body**
```json
{
  "query": "What are the termination clauses in the employment contract?"
}
```

**Validation Rules**
- `query` must be a non-empty string
- Maximum length: 1000 characters

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "answer": "According to the Employment Contract, termination can occur under the following conditions:\n\n1. Either party may terminate with 30 days written notice\n2. Immediate termination for cause including breach of contract, misconduct, or violation of company policies\n3. Termination without cause requires 60 days notice and severance payment\n\nCitation: [Employment_Contract.pdf, Clause 12.1-12.3]",
    "sources": [
      {
        "document": "Employment_Contract.pdf",
        "chunkId": 23,
        "clauseNumber": 12,
        "excerpt": "12.1 Termination Notice: Either party may terminate this agreement by providing thirty (30) days written notice to the other party..."
      },
      {
        "document": "Employment_Contract.pdf",
        "chunkId": 24,
        "clauseNumber": 12,
        "excerpt": "12.2 Termination for Cause: The Company may terminate this agreement immediately for cause, including but not limited to..."
      }
    ],
    "hasAnswer": true,
    "retrievedChunks": 5,
    "query": "What are the termination clauses in the employment contract?",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response When No Answer Found**
```json
{
  "success": true,
  "data": {
    "answer": "The provided documents do not contain this information.",
    "sources": [],
    "hasAnswer": false,
    "retrievedChunks": 0,
    "query": "What is the company's vacation policy?",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request)**
```json
{
  "success": false,
  "error": "Query is required and must be a string"
}
```

**Example (cURL)**
```bash
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the payment terms?"}'
```

**Example (JavaScript)**
```javascript
const response = await fetch('http://localhost:5000/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'What are the payment terms?'
  })
});

const data = await response.json();
console.log(data.data.answer);
console.log(data.data.sources);
```

---

## Response Schema

### Document Object
```typescript
{
  _id: string;              // MongoDB ObjectId
  filename: string;         // Internal filename
  originalName: string;     // Original uploaded filename
  fileSize: number;         // File size in bytes
  totalChunks: number;      // Number of chunks created
  status: 'processing' | 'completed' | 'failed';
  vectorStoreId?: string;   // FAISS index identifier
  uploadedAt: Date;         // Upload timestamp
  processedAt?: Date;       // Processing completion timestamp
  error?: string;           // Error message if failed
}
```

### Source Object
```typescript
{
  document: string;         // Document filename
  chunkId: number;          // Sequential chunk identifier
  clauseNumber: number;     // Legal clause number
  excerpt: string;          // Text excerpt (200 chars)
}
```

### Query Response Object
```typescript
{
  answer: string;           // Generated answer
  sources: Source[];        // Array of source citations
  hasAnswer: boolean;       // Whether answer was found
  retrievedChunks: number;  // Number of chunks retrieved
  query: string;            // Original query
  timestamp: string;        // Response timestamp (ISO 8601)
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 202 | Accepted (async processing started) |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

**Current Limits** (configurable)
- 100 requests per 15 minutes per IP
- Applies to all `/api/*` endpoints

**Rate Limit Headers**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

**Rate Limit Exceeded Response (429)**
```json
{
  "success": false,
  "error": "Too many requests, please try again later"
}
```

---

## CORS Configuration

**Allowed Origins** (Development)
```
http://localhost:3000
http://localhost:5173
```

**Allowed Methods**
```
GET, POST, PUT, DELETE, OPTIONS
```

**Allowed Headers**
```
Content-Type, Authorization
```

---

## Example Workflows

### Complete Document Upload and Query Flow

```javascript
// 1. Upload document
const uploadFormData = new FormData();
uploadFormData.append('document', pdfFile);

const uploadResponse = await fetch('http://localhost:5000/api/documents/upload', {
  method: 'POST',
  body: uploadFormData
});

const uploadData = await uploadResponse.json();
const documentId = uploadData.documentId;

// 2. Poll for processing completion
let status = 'processing';
while (status === 'processing') {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  
  const statusResponse = await fetch(`http://localhost:5000/api/documents/${documentId}`);
  const statusData = await statusResponse.json();
  status = statusData.document.status;
}

if (status === 'completed') {
  // 3. Query the document
  const queryResponse = await fetch('http://localhost:5000/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'What are the key terms of this agreement?'
    })
  });
  
  const queryData = await queryResponse.json();
  console.log('Answer:', queryData.data.answer);
  console.log('Sources:', queryData.data.sources);
}
```

### Batch Document Upload

```javascript
const files = [file1, file2, file3];

const uploadPromises = files.map(file => {
  const formData = new FormData();
  formData.append('document', file);
  
  return fetch('http://localhost:5000/api/documents/upload', {
    method: 'POST',
    body: formData
  }).then(res => res.json());
});

const results = await Promise.all(uploadPromises);
console.log('Uploaded documents:', results);
```

---

## Postman Collection

Import this JSON into Postman for quick testing:

```json
{
  "info": {
    "name": "LegalMind AI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Upload Document",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "document",
              "type": "file",
              "src": []
            }
          ]
        },
        "url": {
          "raw": "{{baseUrl}}/documents/upload",
          "host": ["{{baseUrl}}"],
          "path": ["documents", "upload"]
        }
      }
    },
    {
      "name": "Get All Documents",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/documents",
          "host": ["{{baseUrl}}"],
          "path": ["documents"]
        }
      }
    },
    {
      "name": "Query Documents",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"query\": \"What are the termination clauses?\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/query",
          "host": ["{{baseUrl}}"],
          "path": ["query"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

---

## WebSocket Support (Future Enhancement)

For real-time document processing updates:

```javascript
const ws = new WebSocket('ws://localhost:5000');

ws.on('message', (data) => {
  const update = JSON.parse(data);
  if (update.type === 'processing_complete') {
    console.log('Document ready:', update.documentId);
  }
});
```
