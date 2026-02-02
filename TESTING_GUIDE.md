# LegalMind AI - Testing Guide

## Manual Testing Checklist

### 1. Document Upload Testing

#### Test Case 1.1: Valid PDF Upload
**Steps:**
1. Navigate to the application
2. Click "Upload Document" area
3. Select a valid PDF file (<10MB)
4. Click "Upload Document" button

**Expected Result:**
- Success notification appears
- Document appears in "Uploaded Documents" list with "processing" status
- After ~5-10 seconds, status changes to "completed"
- Chunk count is displayed

**Test Data:**
- Use sample legal documents (contracts, NDAs, agreements)

#### Test Case 1.2: Invalid File Type
**Steps:**
1. Attempt to upload a .docx or .txt file

**Expected Result:**
- Error message: "Only PDF files are allowed"
- File is not uploaded

#### Test Case 1.3: File Size Limit
**Steps:**
1. Attempt to upload a PDF >10MB

**Expected Result:**
- Error message: "File size must be less than 10MB"
- File is not uploaded

#### Test Case 1.4: Multiple Document Upload
**Steps:**
1. Upload 3 different PDF documents sequentially

**Expected Result:**
- All documents appear in the list
- Each processes independently
- No conflicts or errors

---

### 2. Query Testing

#### Test Case 2.1: Basic Query
**Steps:**
1. Upload a sample employment contract
2. Wait for processing to complete
3. Ask: "What are the termination clauses?"

**Expected Result:**
- Answer is returned within 2-3 seconds
- Answer contains relevant information from the document
- Citations are displayed with document name and clause number
- Source excerpts are shown

#### Test Case 2.2: Out-of-Scope Query
**Steps:**
1. With employment contract uploaded
2. Ask: "What is the weather today?"

**Expected Result:**
- Response: "The provided documents do not contain this information."
- No hallucinated answer
- No sources displayed

#### Test Case 2.3: Multi-Document Query
**Steps:**
1. Upload 2-3 different legal documents
2. Ask a question that could be answered by any document

**Expected Result:**
- Answer draws from relevant documents
- Citations show which documents were used
- Multiple sources may be cited

#### Test Case 2.4: Complex Legal Query
**Steps:**
1. Ask: "What are the obligations of both parties under this agreement?"

**Expected Result:**
- Comprehensive answer covering multiple clauses
- Multiple citations
- Structured response

#### Test Case 2.5: Empty Query
**Steps:**
1. Submit empty query or only whitespace

**Expected Result:**
- Send button is disabled
- No API call is made

#### Test Case 2.6: Very Long Query
**Steps:**
1. Submit a query >1000 characters

**Expected Result:**
- Error message about query length
- Query is not processed

---

### 3. UI/UX Testing

#### Test Case 3.1: Loading States
**Steps:**
1. Upload a document
2. Submit a query

**Expected Result:**
- Upload shows progress bar
- Query shows loading spinner with animated dots
- UI elements are disabled during loading

#### Test Case 3.2: Error Display
**Steps:**
1. Trigger various errors (invalid file, failed query, etc.)

**Expected Result:**
- Error messages are clear and user-friendly
- Errors are displayed in red with appropriate styling
- Errors auto-dismiss after 5 seconds (for notifications)

#### Test Case 3.3: Responsive Design
**Steps:**
1. Test on different screen sizes (mobile, tablet, desktop)

**Expected Result:**
- Layout adapts appropriately
- All features remain accessible
- No horizontal scrolling
- Touch-friendly on mobile

#### Test Case 3.4: Chat Scroll Behavior
**Steps:**
1. Submit multiple queries to fill the chat area

**Expected Result:**
- Chat auto-scrolls to latest message
- Scroll is smooth
- User can manually scroll up to view history

---

### 4. Edge Cases and Error Handling

#### Test Case 4.1: No Documents Uploaded
**Steps:**
1. Submit a query without uploading any documents

**Expected Result:**
- Response: "No relevant documents found. Please upload legal documents first."

#### Test Case 4.2: Document Processing Failure
**Steps:**
1. Upload a corrupted or invalid PDF

**Expected Result:**
- Document status shows "failed"
- Error message is displayed
- System remains stable

#### Test Case 4.3: Network Failure
**Steps:**
1. Disconnect network during upload or query

**Expected Result:**
- Appropriate error message
- System recovers gracefully
- No data corruption

#### Test Case 4.4: Concurrent Uploads
**Steps:**
1. Upload multiple documents simultaneously

**Expected Result:**
- All uploads process correctly
- No race conditions
- Status updates correctly for each

---

## API Testing with cURL

### Upload Document
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "document=@sample_contract.pdf" \
  -v
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Document uploaded and processing started",
  "documentId": "...",
  "filename": "sample_contract.pdf"
}
```

### Get All Documents
```bash
curl http://localhost:5000/api/documents
```

### Query Documents
```bash
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the payment terms?"}' \
  -v
```

### Check Document Status
```bash
curl http://localhost:5000/api/documents/{documentId}
```

### Delete Document
```bash
curl -X DELETE http://localhost:5000/api/documents/{documentId}
```

---

## Automated Testing (Future Implementation)

### Backend Unit Tests (Jest)

**File: `backend/src/services/__tests__/chunking.service.test.js`**
```javascript
const chunkingService = require('../chunking.service');

describe('ChunkingService', () => {
  test('should chunk text into appropriate sizes', async () => {
    const text = 'Lorem ipsum...'.repeat(100);
    const chunks = await chunkingService.chunkText(text);
    
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].pageContent.length).toBeLessThanOrEqual(500);
  });

  test('should extract legal clauses', () => {
    const text = 'Clause 1: First clause. Clause 2: Second clause.';
    const clauses = chunkingService.extractClauses(text);
    
    expect(clauses.length).toBe(2);
    expect(clauses[0].number).toBe('1');
  });
});
```

**File: `backend/src/services/__tests__/pdf.service.test.js`**
```javascript
const pdfService = require('../pdf.service');

describe('PDFService', () => {
  test('should extract text from valid PDF', async () => {
    const result = await pdfService.extractText('./test-files/sample.pdf');
    
    expect(result.text).toBeDefined();
    expect(result.numPages).toBeGreaterThan(0);
  });

  test('should clean text properly', () => {
    const dirtyText = 'Text   with    extra\n\n\n\nspaces';
    const cleaned = pdfService.cleanText(dirtyText);
    
    expect(cleaned).toBe('Text with extra\n\nspaces');
  });
});
```

### API Integration Tests (Supertest)

**File: `backend/src/__tests__/api.test.js`**
```javascript
const request = require('supertest');
const app = require('../server');

describe('Document API', () => {
  test('POST /api/documents/upload - valid PDF', async () => {
    const response = await request(app)
      .post('/api/documents/upload')
      .attach('document', './test-files/sample.pdf')
      .expect(202);
    
    expect(response.body.success).toBe(true);
    expect(response.body.documentId).toBeDefined();
  });

  test('POST /api/documents/upload - invalid file type', async () => {
    const response = await request(app)
      .post('/api/documents/upload')
      .attach('document', './test-files/sample.txt')
      .expect(400);
    
    expect(response.body.error).toContain('PDF');
  });

  test('GET /api/documents - list documents', async () => {
    const response = await request(app)
      .get('/api/documents')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.documents)).toBe(true);
  });
});

describe('Query API', () => {
  test('POST /api/query - valid query', async () => {
    const response = await request(app)
      .post('/api/query')
      .send({ query: 'What are the terms?' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.answer).toBeDefined();
  });

  test('POST /api/query - empty query', async () => {
    const response = await request(app)
      .post('/api/query')
      .send({ query: '' })
      .expect(400);
    
    expect(response.body.error).toBeDefined();
  });
});
```

### Frontend Component Tests (React Testing Library)

**File: `frontend/src/components/__tests__/FileUpload.test.jsx`**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../FileUpload';

describe('FileUpload Component', () => {
  test('renders upload area', () => {
    render(<FileUpload onUploadSuccess={() => {}} />);
    expect(screen.getByText(/Click to upload/i)).toBeInTheDocument();
  });

  test('shows error for invalid file type', () => {
    render(<FileUpload onUploadSuccess={() => {}} />);
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText(/Only PDF files/i)).toBeInTheDocument();
  });
});
```

### E2E Tests (Cypress)

**File: `cypress/e2e/document-flow.cy.js`**
```javascript
describe('Document Upload and Query Flow', () => {
  it('should upload document and query successfully', () => {
    cy.visit('http://localhost:3000');
    
    // Upload document
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.pdf');
    cy.contains('Upload Document').click();
    cy.contains('uploaded successfully', { timeout: 10000 });
    
    // Wait for processing
    cy.contains('completed', { timeout: 30000 });
    
    // Submit query
    cy.get('input[placeholder*="Ask"]').type('What are the key terms?');
    cy.contains('Send').click();
    
    // Verify response
    cy.contains('Citation', { timeout: 10000 });
  });
});
```

---

## Performance Testing

### Load Testing with k6

**File: `load-test.js`**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const payload = JSON.stringify({
    query: 'What are the termination clauses?',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('http://localhost:5000/api/query', payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 3s': (r) => r.timings.duration < 3000,
  });

  sleep(1);
}
```

**Run:**
```bash
k6 run load-test.js
```

---

## Test Data

### Sample Legal Documents

Create test PDFs with:
1. **Employment Contract** - Test termination, compensation, benefits queries
2. **NDA Agreement** - Test confidentiality, duration, obligations queries
3. **Service Agreement** - Test payment terms, deliverables, warranties queries
4. **Lease Agreement** - Test rent, maintenance, termination queries

### Sample Queries

**In-Scope Queries:**
- "What are the termination clauses?"
- "What is the notice period?"
- "What are the payment terms?"
- "What are the confidentiality obligations?"
- "What happens in case of breach?"

**Out-of-Scope Queries:**
- "What is the weather today?"
- "Who is the president?"
- "Calculate 2+2"
- "Write me a poem"

**Edge Case Queries:**
- Empty string
- Very long query (>1000 chars)
- Special characters: `<script>alert('xss')</script>`
- SQL injection attempts: `'; DROP TABLE documents;--`

---

## CI/CD Testing Pipeline

### GitHub Actions Workflow

**File: `.github/workflows/test.yml`**
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6.0
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install backend dependencies
        run: cd backend && npm ci
      
      - name: Run backend tests
        run: cd backend && npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/test
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      
      - name: Install frontend dependencies
        run: cd frontend && npm ci
      
      - name: Run frontend tests
        run: cd frontend && npm test
```

---

## Quality Metrics

### Target Metrics

- **Code Coverage**: >80%
- **API Response Time**: <2s (95th percentile)
- **Upload Processing**: <10s per document
- **Error Rate**: <1%
- **Uptime**: >99.9%

### Monitoring

Use tools like:
- **New Relic** / **DataDog** for APM
- **Sentry** for error tracking
- **Prometheus** + **Grafana** for metrics
- **LogRocket** for frontend monitoring

---

## Bug Reporting Template

```markdown
**Bug Description:**
Clear description of the issue

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Backend Version: 1.0.0

**Screenshots:**
[Attach if applicable]

**Logs:**
[Paste relevant logs]
```
