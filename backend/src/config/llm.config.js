// Support both OpenAI (paid) and Google Gemini (free)
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini'; // 'openai' or 'gemini'

const getLLM = () => {
  if (AI_PROVIDER === 'gemini') {
    // Google Gemini - FREE (using lite version for better quota)
    const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
    return new ChatGoogleGenerativeAI({
      modelName: 'gemini-2.5-flash-lite',  // Lite version for free tier
      temperature: 0,
      apiKey: process.env.GOOGLE_API_KEY,
    });
  } else {
    // OpenAI - PAID
    const { ChatOpenAI } = require('@langchain/openai');
    return new ChatOpenAI({
      modelName: process.env.LLM_MODEL || 'gpt-4',
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }
};

const getEmbeddings = () => {
  // IMPORTANT: Google Gemini API doesn't provide embedding models in free tier
  // Solution: Use HuggingFace embeddings (FREE, runs locally, no API key needed)
  
  const { HuggingFaceTransformersEmbeddings } = require('@langchain/community/embeddings/hf_transformers');
  
  console.log('Using HuggingFace local embeddings (free, no API key needed)');
  return new HuggingFaceTransformersEmbeddings({
    modelName: 'Xenova/all-MiniLM-L6-v2',  // Small, fast, accurate model
  });
};

module.exports = {
  getLLM,
  getEmbeddings,
};
