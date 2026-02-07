// List available Google Gemini models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    console.log('Fetching available models from Google Gemini...\n');
    
    // This will show us what models are actually available
    const models = await genAI.listModels();
    
    console.log('=== AVAILABLE MODELS ===\n');
    
    for (const model of models) {
      console.log(`Model: ${model.name}`);
      console.log(`Display Name: ${model.displayName}`);
      console.log(`Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('---');
    }
    
    console.log('\n=== EMBEDDING MODELS ===');
    const embeddingModels = models.filter(m => 
      m.supportedGenerationMethods.includes('embedContent')
    );
    
    if (embeddingModels.length > 0) {
      embeddingModels.forEach(m => {
        console.log(`✅ ${m.name}`);
      });
    } else {
      console.log('❌ No embedding models found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
