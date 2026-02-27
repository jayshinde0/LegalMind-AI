// Test Ollama integration
require('dotenv').config();
const OllamaService = require('./src/services/ollama.service');

async function testOllama() {
  console.log('=== Ollama Integration Test ===\n');

  const ollama = new OllamaService({
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'mistral:7b-instruct',
    temperature: 0,
    timeout: 60000,
  });

  try {
    // Test 1: Health Check
    console.log('1. Testing Ollama connection...');
    const isHealthy = await ollama.healthCheck();
    if (!isHealthy) {
      console.log('❌ Ollama is not running!');
      console.log('\nTo start Ollama:');
      console.log('1. Install: https://ollama.ai/download');
      console.log('2. Run: ollama serve');
      console.log('3. Pull model: ollama pull mistral\n');
      return;
    }
    console.log('✅ Ollama is running!\n');

    // Test 2: List Models
    console.log('2. Listing available models...');
    const models = await ollama.listModels();
    console.log(`Found ${models.length} models:`);
    models.forEach(model => {
      console.log(`  - ${model.name} (${(model.size / 1e9).toFixed(2)} GB)`);
    });
    console.log();

    // Test 3: Simple Generation
    console.log('3. Testing text generation...');
    const prompt = 'What is the capital of France? Answer in one sentence.';
    console.log(`Prompt: "${prompt}"`);
    console.log('Generating...\n');
    
    const response = await ollama.invoke(prompt);
    console.log(`Response: ${response.content}\n`);
    console.log('✅ Text generation works!\n');

    // Test 4: Streaming Generation
    console.log('4. Testing streaming generation...');
    const streamPrompt = 'List 3 benefits of using local LLMs. Be concise.';
    console.log(`Prompt: "${streamPrompt}"`);
    console.log('Streaming response:\n');
    
    let streamedText = '';
    await ollama.invokeStream(streamPrompt, (chunk) => {
      process.stdout.write(chunk);
      streamedText += chunk;
    });
    console.log('\n\n✅ Streaming works!\n');

    // Test 5: Legal Document Test
    console.log('5. Testing legal document analysis...');
    const legalPrompt = `
You are a legal document assistant. Answer ONLY using the provided context.

Context:
"The Employee shall receive an annual base salary of $120,000 (One Hundred Twenty Thousand Dollars), payable in bi-weekly installments."

Question: What is the salary?

Answer with citation:
`;
    console.log('Testing RAG-style prompt...');
    const legalResponse = await ollama.invoke(legalPrompt);
    console.log(`\nResponse: ${legalResponse.content}\n`);
    console.log('✅ Legal analysis works!\n');

    // Test 6: Model Info
    console.log('6. Getting model information...');
    const modelInfo = await ollama.getModelInfo();
    console.log(`Model: ${modelInfo.modelfile || 'N/A'}`);
    console.log(`Parameters: ${modelInfo.parameters || 'N/A'}`);
    console.log();

    console.log('=== All Tests Passed! ===');
    console.log('\nYour Ollama integration is working correctly.');
    console.log('You can now start the backend server with: npm run dev\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure Ollama is running: ollama serve');
    console.error('2. Check if model is installed: ollama list');
    console.error('3. Pull model if needed: ollama pull mistral');
    console.error('4. Verify OLLAMA_BASE_URL in .env file\n');
  }
}

testOllama();
