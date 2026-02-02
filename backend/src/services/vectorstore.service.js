const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { getEmbeddings } = require('../config/llm.config');
const { VECTORSTORE_DIR } = require('../config/constants');
const path = require('path');
const fs = require('fs').promises;

class VectorStoreService {
  constructor() {
    this.vectorStore = null;
    this.embeddings = getEmbeddings();
    this.storePath = path.join(VECTORSTORE_DIR, 'faiss_index');
  }

  async initialize() {
    try {
      await fs.mkdir(VECTORSTORE_DIR, { recursive: true });
      
      try {
        this.vectorStore = await FaissStore.load(this.storePath, this.embeddings);
        console.log('Loaded existing FAISS index');
      } catch (error) {
        console.log('Creating new FAISS index');
        this.vectorStore = await FaissStore.fromDocuments([], this.embeddings);
      }
    } catch (error) {
      throw new Error(`VectorStore initialization failed: ${error.message}`);
    }
  }

  async addDocuments(documents) {
    try {
      if (!this.vectorStore) {
        await this.initialize();
      }

      await this.vectorStore.addDocuments(documents);
      await this.vectorStore.save(this.storePath);
      
      return { success: true, count: documents.length };
    } catch (error) {
      throw new Error(`Failed to add documents: ${error.message}`);
    }
  }

  async similaritySearch(query, k = 5) {
    try {
      if (!this.vectorStore) {
        await this.initialize();
      }

      const results = await this.vectorStore.similaritySearchWithScore(query, k);
      
      return results.map(([doc, score]) => ({
        pageContent: doc.pageContent,
        metadata: doc.metadata,
        score: score,
      }));
    } catch (error) {
      throw new Error(`Similarity search failed: ${error.message}`);
    }
  }

  async deleteBySource(source) {
    try {
      if (!this.vectorStore) {
        await this.initialize();
      }

      await this.vectorStore.delete({ filter: (doc) => doc.metadata.source === source });
      await this.vectorStore.save(this.storePath);
    } catch (error) {
      throw new Error(`Failed to delete documents: ${error.message}`);
    }
  }
}

module.exports = new VectorStoreService();
