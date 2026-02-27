/**
 * Clean up old documents without metadata
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('./src/models/Document.model');
const DocumentTree = require('./src/models/DocumentTree.model');

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find documents without metadata
    const oldDocuments = await Document.find({
      $or: [
        { metadata: { $exists: false } },
        { metadata: {} }
      ]
    });

    console.log(`Found ${oldDocuments.length} old documents to delete:\n`);
    
    for (const doc of oldDocuments) {
      console.log(`Deleting: ${doc.originalName} (${doc._id})`);
      await Document.findByIdAndDelete(doc._id);
    }

    // Find orphaned document trees (trees without matching documents)
    const allTrees = await DocumentTree.find();
    const allDocIds = (await Document.find()).map(d => d._id.toString());
    
    console.log(`\nChecking ${allTrees.length} document trees for orphans...\n`);
    
    for (const tree of allTrees) {
      if (!allDocIds.includes(tree.documentId.toString())) {
        console.log(`Deleting orphaned tree: ${tree.filename} (${tree.documentId})`);
        await DocumentTree.findByIdAndDelete(tree._id);
      }
    }

    console.log('\n✅ Cleanup complete!');
    
    // Show remaining documents
    const remaining = await Document.find();
    console.log(`\nRemaining documents: ${remaining.length}`);
    remaining.forEach(doc => {
      console.log(`  - ${doc.originalName} (${doc.metadata?.totalClauses || 0} clauses)`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

cleanup();
