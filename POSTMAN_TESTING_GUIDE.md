# Postman Testing Guide for LegalMind AI

## Prerequisites
1. Backend server running on `http://localhost:5000`
2. MongoDB connected
3. Ollama running with Mistral model

---

## 📋 Postman Collection Setup

### 1. Create New Collection
- Name: `LegalMind AI`
- Base URL: `http://localhost:5000/api`

---

## 🧪 API Endpoints to Test

### 1️⃣ Health Check

**Request:**
```
GET http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-07T..."
}
```

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:5000/health`
- No headers or body needed

---

### 2️⃣ Upload Document

**Request:**
```
POST http://localhost:5000/api/documents/upload
Content-Type: multipart/form-data
```

**Body (form-data):**
- Key: `document`
- Type: `File`
- Value: Select your PDF file

**Expected Response:**
```json
{
  "success": true,
  "document": {
    "_id": "65c3f1234567890abcdef123",
    "filename": "abc123.pdf",
    "originalName": "EMPLOYMENT AGREEMENT.pdf",
    "status": "processing",
    "uploadDate": "2024-02-07T10:30:00.000Z"
  }
}
```

**Postman Setup:**
1. Method: `POST`
2. URL: `http://localhost:5000/api/documents/upload`
3. Headers: (Auto-set by Postman)
4. Body:
   - Select `form-data`
   - Key: `document`
   - Type: `File` (dropdown)
   - Value: Click "Select Files" and choose your PDF

**Screenshot Instructions:**
![Postman Upload](https://i.imgur.com/example.png)

---

### 3️⃣ Get All Documents

**Request:**
```
GET http://localhost:5000/api/documents
```

**Expected Response:**
```json
{
  "success": true,
  "documents": [
    {
      "_id": "65c3f1234567890abcdef123",
      "filename": "abc123.pdf",
      "originalName": "EMPLOYMENT AGREEMENT.pdf",
      "status": "completed",
      "metadata": {
        "pages": 6,
        "totalClauses": 38,
        "maxDepth": 2,
        "documentType": "employment_agreement"
      },
      "createdAt": "2024-02-07T10:30:00.000Z"
    }
  ]
}
```

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/documents`
- No headers or body needed

---

### 4️⃣ Query Documents (Main Feature!)

**Request:**
```
POST http://localhost:5000/api/query
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "query": "What is the salary?"
}
```

**Expected Response:**
```json
{
  "success": true,
  "answer": "The salary is $120,000 per year or $4,615.38 bi-weekly [Clause 2.1: Base Salary]",
  "confidence": 1.0,
  "method": "tree_reasoning",
  "reasoning": {
    "path": [
      {
        "clauseId": "68d572f2-ba4f-4081-9e8a-f2613e586bc0",
        "number": "2.1",
        "title": "Base Salary",
        "level": 1
      }
    ],
    "explanation": ""
  },
  "citation": {
    "primary": {
      "document": "EMPLOYMENT AGREEMENT.pdf",
      "clauseNumber": "2.1",
      "clauseTitle": "Base Salary",
      "pageNumber": 1,
      "level": 1,
      "excerpt": "The Employee shall receive an annual base salary of $120,000..."
    },
    "path": [...]
  },
  "sources": [...]
}
```

**Postman Setup:**
1. Method: `POST`
2. URL: `http://localhost:5000/api/query`
3. Headers:
   - Key: `Content-Type`
   - Value: `application/json`
4. Body:
   - Select `raw`
   - Select `JSON` from dropdown
   - Paste the JSON body

---

### 5️⃣ Get Document Tree Structure

**Request:**
```
GET http://localhost:5000/api/documents/:id/tree
```

**Example:**
```
GET http://localhost:5000/api/documents/65c3f1234567890abcdef123/tree
```

**Expected Response:**
```json
{
  "success": true,
  "tree": {
    "documentId": "65c3f1234567890abcdef123",
    "filename": "EMPLOYMENT AGREEMENT.pdf",
    "rootNodes": ["uuid1", "uuid2", "uuid3"],
    "clauses": {
      "uuid1": {
        "id": "uuid1",
        "number": "1.1",
        "title": "Position",
        "content": "The Employee is hired as...",
        "pageNumber": 1,
        "level": 1,
        "parentId": null,
        "children": [],
        "metadata": {...}
      }
    },
    "flatIndex": [...],
    "metadata": {
      "totalClauses": 38,
      "maxDepth": 2,
      "documentType": "employment_agreement"
    }
  }
}
```

**Postman Setup:**
1. Method: `GET`
2. URL: `http://localhost:5000/api/documents/YOUR_DOCUMENT_ID/tree`
3. Replace `YOUR_DOCUMENT_ID` with actual ID from step 3

---

### 6️⃣ Delete Document

**Request:**
```
DELETE http://localhost:5000/api/documents/:id
```

**Example:**
```
DELETE http://localhost:5000/api/documents/65c3f1234567890abcdef123
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Postman Setup:**
- Method: `DELETE`
- URL: `http://localhost:5000/api/documents/YOUR_DOCUMENT_ID`

---

## 🧪 Test Scenarios

### Scenario 1: Complete Workflow

1. **Upload Document**
   - POST `/api/documents/upload`
   - Save the `_id` from response

2. **Wait for Processing**
   - GET `/api/documents`
   - Check status is "completed"
   - Note the `totalClauses` count

3. **Query Document**
   - POST `/api/query`
   - Body: `{"query": "What is the salary?"}`
   - Verify confidence is high (>0.8)

4. **View Tree Structure**
   - GET `/api/documents/:id/tree`
   - Explore the clause hierarchy

5. **Delete Document**
   - DELETE `/api/documents/:id`
   - Verify deletion

---

### Scenario 2: Multiple Queries

Test different query types:

**Simple Query:**
```json
{
  "query": "What is the salary?"
}
```

**Complex Query:**
```json
{
  "query": "What happens if I'm terminated without cause?"
}
```

**Multi-Clause Query:**
```json
{
  "query": "What are all the benefits provided?"
}
```

**Negative Query:**
```json
{
  "query": "Is there a probation period?"
}
```

**Irrelevant Query:**
```json
{
  "query": "What is the weather today?"
}
```

---

### Scenario 3: Error Handling

**Test 1: Query without documents**
```json
POST /api/query
Body: {"query": "What is the salary?"}

Expected: 404 - "No documents available for querying"
```

**Test 2: Upload invalid file**
```
POST /api/documents/upload
Body: Upload a .txt file instead of PDF

Expected: 400 - "Only PDF files are allowed"
```

**Test 3: Upload too large file**
```
POST /api/documents/upload
Body: Upload a file > 10MB

Expected: 400 - "File size exceeds the limit"
```

**Test 4: Query while processing**
```
1. Upload document
2. Immediately query (before processing completes)

Expected: 404 - "Document is still being processed"
```

---

## 📊 Postman Collection JSON

Save this as `LegalMind-AI.postman_collection.json`:

```json
{
  "info": {
    "name": "LegalMind AI",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["health"]
        }
      }
    },
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
          "raw": "http://localhost:5000/api/documents/upload",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "documents", "upload"]
        }
      }
    },
    {
      "name": "Get All Documents",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/documents",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "documents"]
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
          "raw": "{\n  \"query\": \"What is the salary?\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/query",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "query"]
        }
      }
    },
    {
      "name": "Get Document Tree",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/documents/:id/tree",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "documents", ":id", "tree"],
          "variable": [
            {
              "key": "id",
              "value": "YOUR_DOCUMENT_ID"
            }
          ]
        }
      }
    },
    {
      "name": "Delete Document",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/documents/:id",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "documents", ":id"],
          "variable": [
            {
              "key": "id",
              "value": "YOUR_DOCUMENT_ID"
            }
          ]
        }
      }
    }
  ]
}
```

---

## 🎯 Quick Test Checklist

- [ ] Health check returns 200
- [ ] Upload PDF succeeds
- [ ] Document status changes to "completed"
- [ ] Query returns answer with confidence
- [ ] Citation includes clause number
- [ ] Tree structure shows all clauses
- [ ] Delete removes document
- [ ] Error handling works correctly

---

## 💡 Pro Tips

1. **Use Environment Variables**
   - Create environment for `base_url`
   - Use `{{base_url}}/api/query`

2. **Save Document ID**
   - Use Tests tab to save ID:
   ```javascript
   pm.environment.set("document_id", pm.response.json().document._id);
   ```

3. **Chain Requests**
   - Upload → Wait → Query → Delete
   - Use Collection Runner

4. **Monitor Response Times**
   - Check if queries complete in <5 seconds
   - Monitor confidence scores

5. **Export Collection**
   - Share with team
   - Version control

---

## 🐛 Troubleshooting

**Issue: Connection refused**
- Solution: Make sure backend is running (`npm start`)

**Issue: 404 on query**
- Solution: Upload a document first and wait for processing

**Issue: Timeout**
- Solution: Check if Ollama is running (`ollama serve`)

**Issue: Low confidence**
- Solution: Try more specific questions

---

## 📸 Screenshot for LinkedIn

Take screenshots of:
1. Query request with JSON body
2. Response showing high confidence (100%)
3. Citation with clause number
4. Complete reasoning path

This shows your API works perfectly! 🚀
