const { getLLM } = require('../config/llm.config');
const { SYSTEM_PROMPT, getUserPrompt, formatContext } = require('../utils/prompts');

class LLMService {
  constructor() {
    this.llm = getLLM();
  }

  async generateAnswer(retrievedDocs, query) {
    try {
      if (!retrievedDocs || retrievedDocs.length === 0) {
        return {
          answer: 'The provided documents do not contain this information.',
          sources: [],
          hasAnswer: false,
        };
      }

      const context = formatContext(retrievedDocs);
      const userPrompt = getUserPrompt(context, query);

      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ];

      const response = await this.llm.invoke(messages);
      
      const sources = this.extractSources(retrievedDocs);

      return {
        answer: response.content,
        sources: sources,
        hasAnswer: !response.content.includes('do not contain this information'),
        retrievedChunks: retrievedDocs.length,
      };
    } catch (error) {
      throw new Error(`LLM generation failed: ${error.message}`);
    }
  }

  extractSources(retrievedDocs) {
    const uniqueSources = new Map();

    retrievedDocs.forEach((doc) => {
      const key = `${doc.metadata.source}-${doc.metadata.chunkId}`;
      if (!uniqueSources.has(key)) {
        uniqueSources.set(key, {
          document: doc.metadata.source,
          chunkId: doc.metadata.chunkId,
          clauseNumber: doc.metadata.clauseNumber || doc.metadata.chunkId,
          excerpt: doc.pageContent.substring(0, 200) + '...',
        });
      }
    });

    return Array.from(uniqueSources.values());
  }
}

module.exports = new LLMService();
