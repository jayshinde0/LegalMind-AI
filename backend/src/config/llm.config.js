// AI Configuration - Support for Ollama (local) and OpenAI (paid)
const AI_PROVIDER = process.env.AI_PROVIDER || 'ollama';

/**
 * Get LLM instance based on provider
 * @returns {Object} LLM instance with invoke method
 */
const getLLM = () => {
  if (AI_PROVIDER === 'ollama') {
    // Ollama - 100% FREE, runs locally
    const OllamaService = require('../services/ollama.service');
    return new OllamaService({
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'mistral:7b-instruct',
      temperature: parseFloat(process.env.OLLAMA_TEMPERATURE) || 0,
      timeout: parseInt(process.env.OLLAMA_TIMEOUT) || 60000,
    });
  } else if (AI_PROVIDER === 'openai') {
    // OpenAI - PAID
    const { ChatOpenAI } = require('@langchain/openai');
    return new ChatOpenAI({
      modelName: process.env.LLM_MODEL || 'gpt-4',
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  } else {
    throw new Error(`Unsupported AI provider: ${AI_PROVIDER}`);
  }
};

/**
 * Get embeddings instance
 * Uses HuggingFace (local, free) for all providers
 * @returns {Object} Embeddings instance
 */
const getEmbeddings = () => {
  // HuggingFace embeddings - FREE, runs locally, no API key needed
  const { HuggingFaceTransformersEmbeddings } = require('@langchain/community/embeddings/hf_transformers');
  
  console.log('Using HuggingFace local embeddings (free, no API key needed)');
  return new HuggingFaceTransformersEmbeddings({
    modelName: 'Xenova/all-MiniLM-L6-v2',  // 384-dimensional embeddings
  });
};

module.exports = {
  getLLM,
  getEmbeddings,
  AI_PROVIDER,
};
