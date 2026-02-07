// Test if API key is being read correctly
require('dotenv').config();

console.log('=== Environment Variables Test ===');
console.log('AI_PROVIDER:', process.env.AI_PROVIDER);
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'SET (length: ' + process.env.GOOGLE_API_KEY.length + ')' : 'NOT SET');
console.log('GOOGLE_API_KEY starts with:', process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.substring(0, 10) + '...' : 'N/A');
console.log('LLM_MODEL:', process.env.LLM_MODEL);
console.log('EMBEDDING_MODEL:', process.env.EMBEDDING_MODEL);
console.log('================================');

// Test Google Gemini API directly
async function testGeminiAPI() {
  try {
    const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
    
    console.log('\n=== Testing Google Gemini API ===');
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'embedding-001',
      apiKey: process.env.GOOGLE_API_KEY,
    });

    console.log('Creating embeddings for test text...');
    const result = await embeddings.embedQuery('test');
    console.log('✅ SUCCESS! Embeddings created, length:', result.length);
    console.log('API key is working correctly!');
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    if (error.message.includes('quota')) {
      console.log('\n⚠️  This is a quota/billing issue with Google API');
      console.log('Even though the key works elsewhere, this project may have hit limits');
    }
  }
}

testGeminiAPI();
