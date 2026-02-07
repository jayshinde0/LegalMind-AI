// Test if API key is working
require('dotenv').config();

console.log('=== Environment Variables Test ===');
console.log('AI_PROVIDER:', process.env.AI_PROVIDER);
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'SET ✅' : 'NOT SET ❌');
console.log('Key starts with:', process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.substring(0, 15) + '...' : 'N/A');
console.log('EMBEDDING_MODEL:', process.env.EMBEDDING_MODEL);
console.log('================================\n');

// Test Google Gemini API directly
async function testGeminiAPI() {
  try {
    const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
    
    console.log('Testing Google Gemini Embeddings API...');
    console.log('Using model: embedding-001');
    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: 'embedding-001',  // Try without text- prefix
      apiKey: process.env.GOOGLE_API_KEY,
    });

    console.log('Sending test request to Google...');
    const result = await embeddings.embedQuery('Hello world');
    console.log('\n✅ SUCCESS! API key is working!');
    console.log('Embedding vector length:', result.length);
    console.log('\nYour API key is valid and working correctly.');
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    
    if (error.message.includes('quota') || error.message.includes('429')) {
      console.log('\n⚠️  QUOTA/BILLING ISSUE DETECTED');
      console.log('This means:');
      console.log('1. Your API key is valid');
      console.log('2. But Google requires billing to be enabled');
      console.log('3. Or you hit the daily quota limit');
      console.log('\nSolution: Enable billing in Google AI Studio');
      console.log('URL: https://aistudio.google.com/app/apikey');
    } else if (error.message.includes('API key')) {
      console.log('\n⚠️  API KEY ISSUE');
      console.log('The API key format or value is incorrect');
    } else if (error.message.includes('404') || error.message.includes('not found')) {
      console.log('\n⚠️  MODEL NOT FOUND');
      console.log('The embedding model name is incorrect');
      console.log('Try: models/text-embedding-004 or models/embedding-001');
    } else {
      console.log('\n⚠️  UNKNOWN ERROR');
      console.log('Full error:', error);
    }
  }
}

testGeminiAPI();
