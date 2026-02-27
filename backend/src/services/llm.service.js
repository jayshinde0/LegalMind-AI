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

      // Combine system prompt with user prompt (Ollama doesn't have separate system role)
      const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

      const response = await this.llm.invoke(fullPrompt);
      
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

  /**
   * Generate answer with streaming support
   * @param {Array} retrievedDocs - Retrieved document chunks
   * @param {string} query - User query
   * @param {Function} onChunk - Callback for each chunk
   * @returns {Promise<Object>} Complete response
   */
  async generateAnswerStream(retrievedDocs, query, onChunk) {
    try {
      if (!retrievedDocs || retrievedDocs.length === 0) {
        const noAnswerResponse = 'The provided documents do not contain this information.';
        if (onChunk) onChunk(noAnswerResponse);
        return {
          answer: noAnswerResponse,
          sources: [],
          hasAnswer: false,
        };
      }

      const context = formatContext(retrievedDocs);
      const userPrompt = getUserPrompt(context, query);
      const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

      // Check if LLM supports streaming
      if (typeof this.llm.invokeStream === 'function') {
        const answer = await this.llm.invokeStream(fullPrompt, onChunk);
        const sources = this.extractSources(retrievedDocs);

        return {
          answer: answer,
          sources: sources,
          hasAnswer: !answer.includes('do not contain this information'),
          retrievedChunks: retrievedDocs.length,
        };
      } else {
        // Fallback to non-streaming
        return await this.generateAnswer(retrievedDocs, query);
      }
    } catch (error) {
      throw new Error(`LLM streaming failed: ${error.message}`);
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
