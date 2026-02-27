/**
 * Tree Builder Service
 * Converts legal documents into hierarchical clause-based tree structure
 * Replaces: chunking.service.js and vectorstore.service.js
 */

const DocumentTree = require('../models/DocumentTree.model');
const { v4: uuidv4 } = require('uuid');

class TreeBuilderService {
  /**
   * Build document tree from extracted text
   * @param {string} text - Full document text
   * @param {string} filename - Document filename
   * @param {string} documentId - MongoDB document ID
   * @returns {Promise<Object>} Document tree
   */
  async buildDocumentTree(text, filename, documentId) {
    try {
      // Step 1: Extract clauses with hierarchy
      const clauses = this.extractClauses(text);
      
      // Step 2: Build tree structure
      const tree = this.buildHierarchy(clauses);
      
      // Step 3: Create flat index for quick lookup
      const flatIndex = this.createFlatIndex(tree.clauses);
      
      // Step 4: Convert Map to plain object for MongoDB
      const clausesObject = {};
      tree.clauses.forEach((value, key) => {
        clausesObject[key] = value;
      });
      
      // Step 5: Save to MongoDB
      const documentTree = await DocumentTree.create({
        documentId: documentId,
        filename: filename,
        rootNodes: tree.rootNodes,
        clauses: clausesObject,
        flatIndex: flatIndex,
        metadata: {
          totalClauses: clauses.length,
          maxDepth: this.calculateMaxDepth(tree.clauses),
          documentType: this.detectDocumentType(text),
          createdAt: new Date(),
        },
      });
      
      return documentTree;
    } catch (error) {
      throw new Error(`Tree building failed: ${error.message}`);
    }
  }

  /**
   * Extract clauses from text with pattern matching
   * @param {string} text - Document text
   * @returns {Array} Array of clause objects
   */
  extractClauses(text) {
    const clauses = [];
    const lines = text.split('\n');
    
    let currentClause = null;
    let currentContent = [];
    let pageNumber = 1;
    let charPosition = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) {
        if (currentContent.length > 0) {
          currentContent.push('');
        }
        continue;
      }
      
      // Check for section headers (e.g., "1. POSITION AND DUTIES")
      const sectionMatch = line.match(/^(\d+)\.\s+([A-Z][A-Z\s]+)$/);
      
      // Check for clause patterns
      // Pattern 1: "1.1 Title:" or "1.1. Title:" or "1.1 Title"
      const clauseMatch = line.match(/^(\d+\.\d+(?:\.\d+)*)\s*\.?\s+([A-Z][^:]*):?\s*(.*)$/);
      
      if (sectionMatch || clauseMatch) {
        // Save previous clause
        if (currentClause) {
          const content = currentContent.join('\n').trim();
          if (content) {  // Only add if content exists
            clauses.push({
              ...currentClause,
              content: content,
              metadata: {
                startChar: charPosition,
                endChar: charPosition + content.length,
                wordCount: content.split(/\s+/).length,
                keywords: this.extractKeywords(currentClause.title + ' ' + content),
              },
            });
          }
        }
        
        if (sectionMatch) {
          // Section header
          const number = sectionMatch[1];
          const title = sectionMatch[2].trim();
          
          currentClause = {
            id: uuidv4(),
            number: number,
            title: title,
            pageNumber: Math.floor(charPosition / 2500) + 1,
            level: 0,
          };
          
          currentContent = [];
        } else if (clauseMatch) {
          // Clause
          const number = clauseMatch[1];
          const title = clauseMatch[2].trim();
          const firstLine = clauseMatch[3].trim();
          
          const level = (number.match(/\./g) || []).length;
          
          currentClause = {
            id: uuidv4(),
            number: number,
            title: title,
            pageNumber: Math.floor(charPosition / 2500) + 1,
            level: level,
          };
          
          currentContent = firstLine ? [firstLine] : [];
        }
      } else if (currentClause) {
        // Add to current clause content
        currentContent.push(line);
      }
      
      charPosition += line.length + 1;
    }
    
    // Save last clause
    if (currentClause) {
      const content = currentContent.join('\n').trim();
      if (content) {
        clauses.push({
          ...currentClause,
          content: content,
          metadata: {
            startChar: charPosition,
            endChar: charPosition + content.length,
            wordCount: content.split(/\s+/).length,
            keywords: this.extractKeywords(currentClause.title + ' ' + content),
          },
        });
      }
    }
    
    // If no clauses found, create a single clause from entire text
    if (clauses.length === 0) {
      clauses.push({
        id: uuidv4(),
        number: '1',
        title: 'Document Content',
        content: text.trim(),
        pageNumber: 1,
        level: 0,
        metadata: {
          startChar: 0,
          endChar: text.length,
          wordCount: text.split(/\s+/).length,
          keywords: this.extractKeywords(text),
        },
      });
    }
    
    return clauses;
  }

  /**
   * Build hierarchical tree from flat clause list
   * @param {Array} clauses - Flat array of clauses
   * @returns {Object} Tree structure
   */
  buildHierarchy(clauses) {
    const clauseMap = new Map();
    const rootNodes = [];
    
    // First pass: Create map of all clauses
    clauses.forEach(clause => {
      clauseMap.set(clause.id, {
        ...clause,
        children: [],
        parentId: null,
      });
    });
    
    // Second pass: Build parent-child relationships
    clauses.forEach(clause => {
      const node = clauseMap.get(clause.id);
      
      // Find parent based on clause number
      const parentNumber = this.getParentNumber(clause.number);
      
      if (parentNumber) {
        // Find parent clause
        const parent = clauses.find(c => c.number === parentNumber);
        if (parent) {
          node.parentId = parent.id;
          clauseMap.get(parent.id).children.push(clause.id);
        } else {
          rootNodes.push(clause.id);
        }
      } else {
        // Top-level clause
        rootNodes.push(clause.id);
      }
    });
    
    return {
      rootNodes: rootNodes,
      clauses: clauseMap,
    };
  }

  /**
   * Get parent clause number from child number
   * @param {string} number - Clause number (e.g., "2.1.3")
   * @returns {string|null} Parent number (e.g., "2.1") or null
   */
  getParentNumber(number) {
    const parts = number.split('.');
    if (parts.length <= 1) return null;
    return parts.slice(0, -1).join('.');
  }

  /**
   * Create flat index for quick lookups
   * @param {Map} clauseMap - Map of clauses
   * @returns {Array} Flat index
   */
  createFlatIndex(clauseMap) {
    const index = [];
    
    clauseMap.forEach((clause, id) => {
      index.push({
        clauseId: id,
        number: clause.number,
        title: clause.title,
        level: clause.level,
        pageNumber: clause.pageNumber,
      });
    });
    
    // Sort by clause number
    index.sort((a, b) => {
      const aParts = a.number.split('.').map(Number);
      const bParts = b.number.split('.').map(Number);
      
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal !== bVal) return aVal - bVal;
      }
      return 0;
    });
    
    return index;
  }

  /**
   * Calculate maximum depth of tree
   * @param {Map} clauseMap - Map of clauses
   * @returns {number} Max depth
   */
  calculateMaxDepth(clauseMap) {
    let maxDepth = 0;
    clauseMap.forEach(clause => {
      const depth = clause.number.split('.').length;
      if (depth > maxDepth) maxDepth = depth;
    });
    return maxDepth;
  }

  /**
   * Detect document type from content
   * @param {string} text - Document text
   * @returns {string} Document type
   */
  detectDocumentType(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('employment agreement')) return 'employment_agreement';
    if (lowerText.includes('non-disclosure')) return 'nda';
    if (lowerText.includes('service agreement')) return 'service_agreement';
    if (lowerText.includes('lease agreement')) return 'lease';
    
    return 'general_contract';
  }

  /**
   * Extract keywords from text
   * @param {string} text - Text to extract keywords from
   * @returns {Array} Keywords
   */
  extractKeywords(text) {
    // Remove common words
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'shall']);
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
    
    // Get unique words
    const uniqueWords = [...new Set(words)];
    
    // Return top 10 most frequent
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    return uniqueWords
      .sort((a, b) => (wordFreq[b] || 0) - (wordFreq[a] || 0))
      .slice(0, 10);
  }

  /**
   * Get document tree by document ID
   * @param {string} documentId - MongoDB document ID
   * @returns {Promise<Object>} Document tree
   */
  async getDocumentTree(documentId) {
    try {
      const tree = await DocumentTree.findOne({ documentId: documentId });
      if (!tree) {
        throw new Error('Document tree not found');
      }
      return tree;
    } catch (error) {
      throw new Error(`Failed to get document tree: ${error.message}`);
    }
  }

  /**
   * Delete document tree
   * @param {string} documentId - MongoDB document ID
   * @returns {Promise<void>}
   */
  async deleteDocumentTree(documentId) {
    try {
      await DocumentTree.deleteOne({ documentId: documentId });
    } catch (error) {
      throw new Error(`Failed to delete document tree: ${error.message}`);
    }
  }
}

module.exports = new TreeBuilderService();
