const { ChatOpenAI } = require('@langchain/openai');
const { OpenAIEmbeddings } = require('@langchain/openai');

const getLLM = () => {
  return new ChatOpenAI({
    modelName: process.env.LLM_MODEL || 'gpt-4',
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
};

const getEmbeddings = () => {
  return new OpenAIEmbeddings({
    modelName: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
};

module.exports = {
  getLLM,
  getEmbeddings,
};
