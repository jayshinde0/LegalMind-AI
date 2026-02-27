/**
 * Debug tree structure
 */

require('dotenv').config();
const mongoose = require('mongoose');
const pdfService = require('./src/services/pdf.service');
const treeBuilderService = require('./src/services/tree-builder.service');
const path = require('path');

async function debugTree() {
  try {
    console.log('=== Debug Tree Structure ===\n');

    await mongoose.connect(process.env.MONGODB_URI);

    const pdfPath = path.join(__dirname, '..', 'EMPLOYMENT AGREEMENT.pdf');
    const pdfData = await pdfService.extractText(pdfPath);
    const extractedText = pdfData.text;

    const documentTree = await treeBuilderService.buildDocumentTree(
      extractedText,
      'EMPLOYMENT AGREEMENT.pdf',
      new mongoose.Types.ObjectId()
    );

    console.log('Root Nodes:');
    documentTree.rootNodes.forEach(id => {
      const clause = documentTree.clauses.get(id);
      console.log(`  ID: ${id}`);
      console.log(`  Number: ${clause.number}`);
      console.log(`  Title: ${clause.title}`);
      console.log(`  Content preview: ${clause.content.substring(0, 100)}...\n`);
    });

    console.log('\nAll Clauses (first 10):');
    let count = 0;
    documentTree.clauses.forEach((clause, id) => {
      if (count < 10) {
        console.log(`  ${clause.number}. ${clause.title} (ID: ${id})`);
        count++;
      }
    });

    await documentTree.deleteOne();
    await mongoose.disconnect();

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

debugTree();
