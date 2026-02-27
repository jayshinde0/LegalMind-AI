/**
 * Check documents in database
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('./src/models/Document.model');
const DocumentTree = require('./src/models/DocumentTree.model');

async function checkDocuments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check documents
    const documents = await Document.find();
    console.log(`Found ${documents.length} documents:\n`);
    
    documents.forEach(doc => {
      console.log(`ID: ${doc._id}`);
      console.log(`Filename: ${doc.filename}`);
      console.log(`Original Name: ${doc.originalName}`);
      console.log(`Status: ${doc.status}`);
      console.log(`Metadata:`, doc.metadata);
      console.log('---\n');
    });

    // Check document trees
    const trees = await DocumentTree.find();
    console.log(`\nFound ${trees.length} document trees:\n`);
    
    trees.forEach(tree => {
      console.log(`Document ID: ${tree.documentId}`);
      console.log(`Filename: ${tree.filename}`);
      console.log(`Total Clauses: ${tree.metadata.totalClauses}`);
      console.log(`Max Depth: ${tree.metadata.maxDepth}`);
      console.log('---\n');
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkDocuments();
