const vectorStoreService = require('./vectorstore.service');
const llmService = require('./llm.service');
const { TOP_K_RESULTS } = require('../config/constants');

class RetrievalService {
  async query(userQuery, topK = TOP_K_RESULTS) {
    try {
      const retrievedDocs = await vectorStoreService.similaritySearch(userQuery, topK);

      if (retrievedDocs.length === 0) {
        return {
          answer: 'No relevant documents found. Please upload legal documents first.',
          sources: [],
          hasAnswer: false,
        };
      }

      const result = await llmService.generateAnswer(retrievedDocs, userQuery);

      return {
        ...result,
        query: userQuery,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Query processing failed: ${error.message}`);
    }
  }
}

module.exports = new RetrievalService();
