// List all available Google Gemini models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    console.log('Fetching available models from Google Gemini API...\n');
    
    // Use the native Google SDK to list models
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + process.env.GOOGLE_API_KEY);
    const data = await response.json();
    
    if (data.models) {
      console.log('=== AVAILABLE MODELS ===\n');
      
      const embeddingModels = [];
      const chatModels = [];
      
      data.models.forEach(model => {
        const name = model.name.replace('models/', '');
        const methods = model.supportedGenerationMethods || [];
        
        if (methods.includes('embedContent')) {
          embeddingModels.push(name);
        }
        if (methods.includes('generateContent')) {
          chatModels.push(name);
        }
      });
      
      console.log('📊 EMBEDDING MODELS (for vectorstore):');
      embeddingModels.forEach(m => console.log('  ✓', m));
      
      console.log('\n💬 CHAT MODELS (for LLM):');
      chatModels.forEach(m => console.log('  ✓', m));
      
      console.log('\n=== RECOMMENDED CONFIGURATION ===');
      console.log('EMBEDDING_MODEL=' + (embeddingModels[0] || 'text-embedding-004'));
      console.log('LLM_MODEL=' + (chatModels.find(m => m.includes('flash')) || chatModels[0]));
      
    } else {
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('Error listing models:', error.message);
  }
}

listModels();
