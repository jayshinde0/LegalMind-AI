// Quick test to verify PDF upload works
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    // Find a PDF file in uploads folder
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.pdf'));
    
    if (files.length === 0) {
      console.log('❌ No PDF files found in uploads folder');
      console.log('Please add a PDF file to backend/uploads/ folder first');
      return;
    }
    
    const testFile = path.join(uploadsDir, files[0]);
    console.log('📄 Testing with file:', files[0]);
    
    const form = new FormData();
    form.append('document', fs.createReadStream(testFile));
    
    console.log('📤 Uploading to http://localhost:5000/api/documents/upload...');
    
    const response = await fetch('http://localhost:5000/api/documents/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Upload successful!');
      console.log('Document ID:', data.document._id);
      console.log('Chunks created:', data.document.chunkCount);
      console.log('\n🎉 System is working! You can now:');
      console.log('1. Open http://localhost:3001 in your browser');
      console.log('2. Upload PDF files');
      console.log('3. Ask questions about the documents');
    } else {
      console.log('❌ Upload failed:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure:');
    console.log('1. Backend is running (npm run dev in backend folder)');
    console.log('2. MongoDB is connected');
    console.log('3. PDF file exists in uploads folder');
  }
}

testUpload();
