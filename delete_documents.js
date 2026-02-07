// Run this script to delete all documents from MongoDB
// Usage: node delete_documents.js

require('dotenv').config();
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  filePath: String,
  fileSize: Number,
  totalChunks: Number,
  status: String,
  vectorStoreId: String,
  uploadedAt: Date,
  processedAt: Date,
  error: String,
});

const Document = mongoose.model('Document', documentSchema);

async function deleteAllDocuments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Document.deleteMany({});
    console.log(`Deleted ${result.deletedCount} documents`);

    await mongoose.connection.close();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteAllDocuments();
