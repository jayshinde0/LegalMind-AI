/**
 * Test tree-based reasoning system
 */

require('dotenv').config();
const mongoose = require('mongoose');
const treeBuilderService = require('./src/services/tree-builder.service');
const treeReasonerService = require('./src/services/tree-reasoner.service');

// Sample legal document text
const sampleDocument = `
EMPLOYMENT AGREEMENT

This Employment Agreement is entered into between TechCorp Solutions Inc. and John Doe.

1. POSITION AND DUTIES

1.1 Position: The Employee is hired as a Senior Software Engineer in the Engineering Department.

1.2 Duties: The Employee shall perform the following duties:
- Design and develop software applications
- Conduct code reviews and provide technical guidance
- Collaborate with cross-functional teams

1.3 Reporting: The Employee shall report directly to the Chief Technology Officer.

2. COMPENSATION AND BENEFITS

2.1 Base Salary: The Employee shall receive an annual base salary of $120,000 (One Hundred Twenty Thousand Dollars), payable in bi-weekly installments of $4,615.38.

2.2 Performance Bonus: The Employee is eligible for an annual performance bonus of up to 15% of base salary, based on individual and company performance metrics.

2.3 Stock Options: The Employee shall receive 5,000 stock options vesting over 4 years with a 1-year cliff.

2.4 Health Benefits: Comprehensive health insurance (medical, dental, vision). Company pays 80% of premiums.

3. TERMINATION

3.1 Notice Period: Either party may terminate this agreement with 30 days written notice.

3.2 Termination for Cause: The Employer may terminate immediately without notice for gross misconduct, breach of confidentiality, or violation of company policies.

3.3 Severance: If the Employer terminates without cause, the Employee shall receive 2 months of severance pay and continuation of health benefits for 60 days.
`;

async function testTreeReasoning() {
  try {
    console.log('=== Tree-Based Reasoning Test ===\n');

    // Connect to MongoDB
    console.log('1. Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Build document tree
    console.log('2. Building document tree...');
    const documentTree = await treeBuilderService.buildDocumentTree(
      sampleDocument,
      'test_employment_agreement.pdf',
      new mongoose.Types.ObjectId()
    );
    console.log(`✅ Tree built with ${documentTree.metadata.totalClauses} clauses`);
    console.log(`   Max depth: ${documentTree.metadata.maxDepth}`);
    console.log(`   Document type: ${documentTree.metadata.documentType}\n`);

    // Display tree structure
    console.log('3. Document Structure:');
    documentTree.flatIndex.forEach(item => {
      const indent = '  '.repeat(item.level);
      console.log(`${indent}${item.number}. ${item.title} (Page ${item.pageNumber})`);
    });
    console.log();

    // Test queries
    const testQueries = [
      'What is the salary?',
      'What is the notice period for termination?',
      'What stock options are provided?',
      'What happens if I am terminated without cause?',
    ];

    for (const query of testQueries) {
      console.log(`\n4. Testing Query: "${query}"`);
      console.log('─'.repeat(60));

      const result = await treeReasonerService.reasonOverTree(query, documentTree);

      console.log(`\nReasoning Path:`);
      result.reasoning.path.forEach((step, idx) => {
        console.log(`  ${idx + 1}. Clause ${step.number}: ${step.title} (Level ${step.level})`);
      });

      console.log(`\nAnswer:`);
      console.log(`  ${result.answer}`);

      console.log(`\nConfidence: ${(result.confidence * 100).toFixed(1)}%`);

      console.log(`\nCitation:`);
      console.log(`  Document: ${result.citation.primary.document}`);
      console.log(`  Clause: ${result.citation.primary.clauseNumber} - ${result.citation.primary.clauseTitle}`);
      console.log(`  Page: ${result.citation.primary.pageNumber}`);

      console.log('\n' + '='.repeat(60));
    }

    // Test low confidence / fallback
    console.log(`\n5. Testing Fallback (Low Confidence Query):`);
    const fallbackQuery = 'What is the weather today?';
    console.log(`Query: "${fallbackQuery}"`);

    const fallbackResult = await treeReasonerService.hybridFallback(
      fallbackQuery,
      documentTree
    );

    console.log(`\nFallback Result:`);
    console.log(`  Answer: ${fallbackResult.answer}`);
    console.log(`  Confidence: ${(fallbackResult.confidence * 100).toFixed(1)}%`);
    console.log(`  Method: ${fallbackResult.reasoning.method}`);

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

testTreeReasoning();
