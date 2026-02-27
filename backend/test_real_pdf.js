/**
 * Test tree-based reasoning with real PDF
 */

require('dotenv').config();
const mongoose = require('mongoose');
const pdfService = require('./src/services/pdf.service');
const treeBuilderService = require('./src/services/tree-builder.service');
const treeReasonerService = require('./src/services/tree-reasoner.service');
const path = require('path');

async function testRealPDF() {
  try {
    console.log('=== Testing with Real Employment Agreement PDF ===\n');

    // Connect to MongoDB
    console.log('1. Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Extract text from PDF
    console.log('2. Extracting text from PDF...');
    const pdfPath = path.join(__dirname, '..', 'EMPLOYMENT AGREEMENT.pdf');
    const pdfData = await pdfService.extractText(pdfPath);
    const extractedText = pdfData.text;
    console.log(`✅ Extracted ${extractedText.length} characters from ${pdfData.numPages} pages\n`);

    // Build document tree
    console.log('3. Building document tree...');
    const documentTree = await treeBuilderService.buildDocumentTree(
      extractedText,
      'EMPLOYMENT AGREEMENT.pdf',
      new mongoose.Types.ObjectId()
    );
    console.log(`✅ Tree built with ${documentTree.metadata.totalClauses} clauses`);
    console.log(`   Max depth: ${documentTree.metadata.maxDepth}`);
    console.log(`   Document type: ${documentTree.metadata.documentType}\n`);

    // Display tree structure (first 20 clauses)
    console.log('4. Document Structure (first 20 clauses):');
    documentTree.flatIndex.slice(0, 20).forEach(item => {
      const indent = '  '.repeat(item.level);
      console.log(`${indent}${item.number}. ${item.title} (Page ${item.pageNumber})`);
    });
    console.log(`   ... and ${documentTree.flatIndex.length - 20} more clauses\n`);

    // Test queries
    const testQueries = [
      'What is the salary?',
      'What are the working hours?',
      'What is the notice period?',
      'What benefits are provided?',
      'Can I work remotely?',
    ];

    for (const query of testQueries) {
      console.log(`\n5. Query: "${query}"`);
      console.log('─'.repeat(60));

      const result = await treeReasonerService.reasonOverTree(query, documentTree);

      console.log(`Answer: ${result.answer}`);
      console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`Citation: Clause ${result.citation.primary.clauseNumber} - ${result.citation.primary.clauseTitle} (Page ${result.citation.primary.pageNumber})`);
      console.log('─'.repeat(60));
    }

    // Cleanup
    console.log('\n6. Cleaning up...');
    await documentTree.deleteOne();
    await mongoose.disconnect();
    console.log('✅ Test complete!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testRealPDF();
