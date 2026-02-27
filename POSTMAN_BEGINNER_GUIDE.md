# Complete Postman Guide for Beginners - LegalMind AI

## 📥 Step 1: Install Postman

### Option A: Desktop App (Recommended)
1. Go to https://www.postman.com/downloads/
2. Download for Windows
3. Install and open Postman
4. Sign up (free account) or skip

### Option B: Web Version
1. Go to https://web.postman.co/
2. Sign in with Google/Email
3. Use in browser (no installation needed)

---

## 🚀 Step 2: Start Your Backend Server

Before testing, make sure your server is running:

```bash
# Terminal 1 - Start Ollama
ollama serve

# Terminal 2 - Start Backend
cd backend
npm start

# You should see:
# Server running on http://localhost:5000
```

---

## 📋 Step 3: Create Your First Request

### Test 1: Health Check (Easiest!)

1. **Open Postman**
2. **Click "New" → "HTTP Request"** (or press Ctrl+N)
3. **You'll see:**
   ```
   [GET ▼] [Enter URL here]
   ```

4. **Enter URL:**
   ```
   http://localhost:5000/health
   ```

5. **Click "Send" button** (blue button on right)

6. **You should see response:**
   ```json
   {
     "status": "ok",
     "timestamp": "2024-02-07T..."
   }
   ```

✅ **Success!** Your backend is working!

---

## 📤 Step 4: Upload a Document

### Test 2: Upload PDF

1. **Click "New" → "HTTP Request"**

2. **Change method from GET to POST:**
   - Click the dropdown that says "GET"
   - Select "POST"

3. **Enter URL:**
   ```
   http://localhost:5000/api/documents/upload
   ```

4. **Setup the file upload:**
   - Click "Body" tab (below URL bar)
   - Select "form-data" (radio button)
   - In the KEY column, type: `document`
   - In the KEY column, hover and change type from "Text" to "File"
   - In the VALUE column, click "Select Files"
   - Choose your PDF file (e.g., EMPLOYMENT AGREEMENT.pdf)

5. **Click "Send"**

6. **You should see response:**
   ```json
   {
     "success": true,
     "document": {
       "_id": "65c3f1234567890abcdef123",
       "filename": "abc123.pdf",
       "originalName": "EMPLOYMENT AGREEMENT.pdf",
       "status": "processing"
     }
   }
   ```

7. **IMPORTANT: Copy the `_id` value!** You'll need it later.

---

## 🔍 Step 5: Check Document Status

### Test 3: Get All Documents

1. **Click "New" → "HTTP Request"**

2. **Method: GET** (default)

3. **Enter URL:**
   ```
   http://localhost:5000/api/documents
   ```

4. **Click "Send"**

5. **You should see:**
   ```json
   {
     "success": true,
     "documents": [
       {
         "_id": "65c3f1234567890abcdef123",
         "originalName": "EMPLOYMENT AGREEMENT.pdf",
         "status": "completed",  ← Wait for this!
         "metadata": {
           "totalClauses": 38
         }
       }
     ]
   }
   ```

6. **Wait until status is "completed"** (refresh by clicking Send again)

---

## 💬 Step 6: Query Your Document (The Main Feature!)

### Test 4: Ask a Question

1. **Click "New" → "HTTP Request"**

2. **Method: POST**

3. **Enter URL:**
   ```
   http://localhost:5000/api/query
   ```

4. **Add Header:**
   - Click "Headers" tab
   - KEY: `Content-Type`
   - VALUE: `application/json`

5. **Add Body:**
   - Click "Body" tab
   - Select "raw" (radio button)
   - Change dropdown from "Text" to "JSON"
   - Paste this:
   ```json
   {
     "query": "What is the salary?"
   }
   ```

6. **Click "Send"**

7. **You should see:**
   ```json
   {
     "success": true,
     "answer": "The salary is $120,000 per year...",
     "confidence": 1.0,
     "citation": {
       "primary": {
         "clauseNumber": "2.1",
         "clauseTitle": "Base Salary"
       }
     }
   }
   ```

🎉 **Congratulations!** Your AI is working!

---

## 🌳 Step 7: View Document Tree Structure

### Test 5: See the Clause Hierarchy

1. **Click "New" → "HTTP Request"**

2. **Method: GET**

3. **Enter URL:** (replace YOUR_ID with the _id from Step 4)
   ```
   http://localhost:5000/api/documents/65c3f1234567890abcdef123/tree
   ```

4. **Click "Send"**

5. **You should see:**
   ```json
   {
     "success": true,
     "tree": {
       "filename": "EMPLOYMENT AGREEMENT.pdf",
       "metadata": {
         "totalClauses": 38,
         "maxDepth": 2
       },
       "flatIndex": [
         {
           "number": "1.1",
           "title": "Position"
         },
         {
           "number": "2.1",
           "title": "Base Salary"
         }
       ]
     }
   }
   ```

---

## 🗑️ Step 8: Delete Document (Optional)

### Test 6: Clean Up

1. **Click "New" → "HTTP Request"**

2. **Method: DELETE**
   - Click "GET" dropdown
   - Select "DELETE"

3. **Enter URL:** (replace YOUR_ID)
   ```
   http://localhost:5000/api/documents/65c3f1234567890abcdef123
   ```

4. **Click "Send"**

5. **You should see:**
   ```json
   {
     "success": true,
     "message": "Document deleted successfully"
   }
   ```

---

## 📚 Step 9: Save Your Requests (Important!)

### Create a Collection

1. **Click "Collections" in left sidebar**

2. **Click "+" or "Create Collection"**

3. **Name it:** `LegalMind AI`

4. **Save each request:**
   - In any request, click "Save" button (top right)
   - Choose "LegalMind AI" collection
   - Give it a name (e.g., "Upload Document")
   - Click "Save"

Now you can reuse these requests anytime!

---

## 🎯 Step 10: Try More Queries

### Different Questions to Test

**Query 1: Working Hours**
```json
{
  "query": "What are the working hours?"
}
```

**Query 2: Benefits**
```json
{
  "query": "What benefits are provided?"
}
```

**Query 3: Termination**
```json
{
  "query": "What happens if I'm terminated without cause?"
}
```

**Query 4: Remote Work**
```json
{
  "query": "Can I work remotely?"
}
```

**Query 5: Notice Period**
```json
{
  "query": "What is the notice period?"
}
```

**Query 6: Vacation**
```json
{
  "query": "How many vacation days do I get?"
}
```

---

## 🎨 Visual Guide (What You Should See)

### Postman Interface Layout:

```
┌─────────────────────────────────────────────────────────┐
│  File  Edit  View  Help                    [Save] [Send]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [POST ▼] http://localhost:5000/api/query              │
│                                                          │
│  Params  Authorization  Headers  Body  Pre-request      │
│  ─────────────────────────────────────────────────      │
│                                                          │
│  ○ none  ○ form-data  ● raw  ○ binary  [JSON ▼]       │
│                                                          │
│  {                                                       │
│    "query": "What is the salary?"                       │
│  }                                                       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Response                                    200 OK      │
│  ─────────────────────────────────────────────────      │
│  Body  Cookies  Headers  Test Results                   │
│                                                          │
│  {                                                       │
│    "success": true,                                     │
│    "answer": "The salary is $120,000...",              │
│    "confidence": 1.0                                    │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Problem 1: "Could not get any response"
**Solution:**
- Check if backend is running: `npm start` in backend folder
- Check URL is correct: `http://localhost:5000`
- Check firewall isn't blocking port 5000

### Problem 2: "404 Not Found"
**Solution:**
- Check URL spelling
- Make sure you uploaded a document first
- Wait for document status to be "completed"

### Problem 3: "No documents available for querying"
**Solution:**
- Upload a document first (Step 4)
- Wait for processing to complete (Step 5)

### Problem 4: "Document is still being processed"
**Solution:**
- Wait 5-10 seconds
- Check status again (Step 5)
- Processing takes ~3 seconds for 38 clauses

### Problem 5: "Connection refused"
**Solution:**
- Make sure Ollama is running: `ollama serve`
- Make sure backend is running: `npm start`
- Check MongoDB is connected

---

## 💡 Pro Tips

### Tip 1: Use Variables
Instead of typing the full URL every time:
1. Click "Environments" (left sidebar)
2. Create new environment: "Local"
3. Add variable:
   - KEY: `base_url`
   - VALUE: `http://localhost:5000`
4. Use in requests: `{{base_url}}/api/query`

### Tip 2: Auto-Save Document ID
In the "Tests" tab of Upload request, add:
```javascript
pm.environment.set("document_id", pm.response.json().document._id);
```

Then use: `{{base_url}}/api/documents/{{document_id}}/tree`

### Tip 3: Organize Requests
Create folders in your collection:
- 📁 Documents
  - Upload Document
  - Get Documents
  - Delete Document
- 📁 Queries
  - Query Salary
  - Query Benefits
  - Query Termination

### Tip 4: Share Collection
1. Click "..." on collection
2. Select "Export"
3. Save as JSON
4. Share with team

---

## 📊 Quick Reference Card

| Action | Method | URL | Body Type |
|--------|--------|-----|-----------|
| Health Check | GET | `/health` | None |
| Upload PDF | POST | `/api/documents/upload` | form-data |
| Get Documents | GET | `/api/documents` | None |
| Query | POST | `/api/query` | JSON |
| Get Tree | GET | `/api/documents/:id/tree` | None |
| Delete | DELETE | `/api/documents/:id` | None |

---

## 🎯 Complete Test Workflow

Follow this order:

1. ✅ Health Check → Verify backend is running
2. ✅ Upload Document → Get document ID
3. ✅ Get Documents → Wait for "completed" status
4. ✅ Query Document → Test AI responses
5. ✅ Get Tree → View document structure
6. ✅ Delete Document → Clean up

---

## 📸 Screenshots for LinkedIn

Take screenshots of:

1. **Upload Request**
   - Show form-data with file selected
   - Show successful response

2. **Query Request**
   - Show JSON body with question
   - Show response with high confidence

3. **Response Details**
   - Show answer text
   - Show confidence: 100%
   - Show citation with clause number

This proves your API works! 🚀

---

## 🎓 Next Steps

After mastering basic requests:

1. **Learn Collection Runner**
   - Run all requests in sequence
   - Automated testing

2. **Write Tests**
   - Validate response status
   - Check confidence scores
   - Verify citations

3. **Use Pre-request Scripts**
   - Generate dynamic data
   - Set up test data

4. **Monitor Performance**
   - Track response times
   - Set up alerts

5. **Create Documentation**
   - Auto-generate API docs
   - Share with team

---

## 🆘 Need Help?

If you're stuck:

1. Check backend logs in terminal
2. Check Ollama is running: `ollama list`
3. Check MongoDB connection
4. Review error messages in Postman
5. Check `POSTMAN_TESTING_GUIDE.md` for advanced tips

---

## ✅ Success Checklist

- [ ] Postman installed and opened
- [ ] Backend server running
- [ ] Ollama running with Mistral
- [ ] Health check returns 200 OK
- [ ] Document uploaded successfully
- [ ] Document status is "completed"
- [ ] Query returns answer with confidence
- [ ] Citation shows clause number
- [ ] All requests saved in collection

**All checked?** You're ready to demo your project! 🎉

---

## 🚀 You're Ready!

You now know how to:
- ✅ Test your API with Postman
- ✅ Upload documents
- ✅ Query with AI
- ✅ View results
- ✅ Debug issues

Go build something amazing! 💪
