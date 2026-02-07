// Test query endpoint
async function testQuery() {
  try {
    console.log('🔍 Testing query endpoint...\n');
    
    const query = 'What is this document about?';
    console.log('Question:', query);
    console.log('Sending to: http://localhost:5000/api/query\n');
    
    const response = await fetch('http://localhost:5000/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Query successful!\n');
      console.log('Answer:', data.answer);
      console.log('\nSources:');
      data.sources.forEach((source, i) => {
        console.log(`${i + 1}. ${source.source} (Page ${source.page})`);
      });
    } else {
      console.log('❌ Query failed:', data.error);
      
      if (data.error.includes('No documents')) {
        console.log('\n💡 This is normal if no documents are uploaded yet.');
        console.log('Upload a PDF first using the web interface at http://localhost:3001');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure backend is running: npm run dev');
  }
}

testQuery();
