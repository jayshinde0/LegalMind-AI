const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { CHUNK_SIZE, CHUNK_OVERLAP } = require('../config/constants');

class ChunkingService {
  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
      separators: ['\n\n', '\n', '. ', ' ', ''],
    });
  }

  async chunkText(text, metadata = {}) {
    try {
      const docs = await this.splitter.createDocuments([text], [metadata]);
      
      return docs.map((doc, idx) => ({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          chunkId: idx + 1,
        },
      }));
    } catch (error) {
      throw new Error(`Chunking failed: ${error.message}`);
    }
  }

  async chunkLegalDocument(text, documentName) {
    const clauses = this.extractClauses(text);
    
    if (clauses.length > 0) {
      return clauses.map((clause, idx) => ({
        pageContent: clause.text,
        metadata: {
          source: documentName,
          chunkId: idx + 1,
          clauseNumber: clause.number || idx + 1,
        },
      }));
    }
    
    return this.chunkText(text, { source: documentName });
  }

  extractClauses(text) {
    const clausePatterns = [
      /(?:Clause|Section|Article)\s+(\d+(?:\.\d+)*)[:\.]?\s*([^\n]+(?:\n(?!(?:Clause|Section|Article)\s+\d+)[^\n]+)*)/gi,
      /(\d+\.\s+[A-Z][^\n]+(?:\n(?!\d+\.)[^\n]+)*)/g,
    ];

    const clauses = [];
    
    for (const pattern of clausePatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > 0) {
        matches.forEach((match) => {
          clauses.push({
            number: match[1] || null,
            text: match[0].trim(),
          });
        });
        break;
      }
    }

    return clauses;
  }
}

module.exports = new ChunkingService();
