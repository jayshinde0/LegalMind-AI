/**
 * Tree Reasoner Service
 * LLM-based reasoning over document tree structure
 * Replaces: retrieval.service.js (vector similarity search)
 */

const { getLLM } = require('../config/llm.config');
const { 
  getTreeReasoningPrompt, 
  getClauseSelectionPrompt,
  getGroundedAnswerPrompt 
} = require('../utils/tree-prompts');

class TreeReasonerService {
  constructor() {
    this.llm = getLLM();
    this.confidenceThreshold = 0.7;
  }

  /**
   * Main reasoning pipeline
   * @param {string} query - User query
   * @param {Object} documentTree - Document tree from MongoDB
   * @returns {Promise<Object>} Reasoning result with answer and path
   */
  async reasonOverTree(query, documentTree) {
    try {
      // Step 1: Reason over top-level clauses
      const topLevelSelection = await this.selectTopLevelClause(
        query,
        documentTree.rootNodes,
        documentTree.clauses
      );
      
      // Step 2: Traverse deeper if needed
      const traversalPath = await this.traverseTree(
        query,
        topLevelSelection.clauseId,
        documentTree.clauses
      );
      
      // Step 3: Extract full section content
      const sectionContent = this.extractSectionContent(
        traversalPath,
        documentTree.clauses
      );
      
      // Step 4: Generate grounded answer
      const answer = await this.generateGroundedAnswer(
        query,
        sectionContent,
        traversalPath
      );
      
      // Step 5: Build citation
      const citation = this.buildCitation(traversalPath, documentTree);
      
      return {
        answer: answer.text,
        confidence: answer.confidence,
        reasoning: {
          path: traversalPath.map(id => {
            const clause = documentTree.clauses.get(id);
            return {
              clauseId: id,
              number: clause.number,
              title: clause.title,
              level: clause.level,
            };
          }),
          topLevelReasoning: topLevelSelection.reasoning,
        },
        citation: citation,
        sectionContent: sectionContent,
      };
    } catch (error) {
      throw new Error(`Tree reasoning failed: ${error.message}`);
    }
  }

  /**
   * Select most relevant top-level clause using LLM reasoning
   * @param {string} query - User query
   * @param {Array} rootNodes - Top-level clause IDs
   * @param {Map} clauseMap - All clauses
   * @returns {Promise<Object>} Selected clause and reasoning
   */
  async selectTopLevelClause(query, rootNodes, clauseMap) {
    try {
      // Build clause summaries
      const clauseSummaries = rootNodes.map(id => {
        const clause = clauseMap.get(id);
        return {
          id: id,
          number: clause.number,
          title: clause.title,
          preview: clause.content.substring(0, 200),
        };
      });
      
      // Create reasoning prompt
      const prompt = getClauseSelectionPrompt(query, clauseSummaries);
      
      // Get LLM reasoning with retry
      const response = await this.invokeWithRetry(prompt);
      
      // Parse response
      const parsed = this.parseSelectionResponse(response.content, clauseSummaries);
      
      // Validate selected ID exists
      if (!parsed.selectedId || !clauseMap.has(parsed.selectedId)) {
        // Fallback: use first clause
        console.warn('Invalid clause ID selected, using first clause');
        return {
          clauseId: rootNodes[0],
          reasoning: 'Fallback to first clause',
          confidence: 0.5,
        };
      }
      
      return {
        clauseId: parsed.selectedId,
        reasoning: parsed.reasoning,
        confidence: parsed.confidence,
      };
    } catch (error) {
      throw new Error(`Top-level selection failed: ${error.message}`);
    }
  }

  /**
   * Traverse tree depth-first based on query relevance
   * @param {string} query - User query
   * @param {string} startClauseId - Starting clause ID
   * @param {Map} clauseMap - All clauses
   * @returns {Promise<Array>} Path of clause IDs from root to leaf
   */
  async traverseTree(query, startClauseId, clauseMap) {
    const path = [startClauseId];
    let currentClauseId = startClauseId;
    
    while (true) {
      const currentClause = clauseMap.get(currentClauseId);
      
      // If no children, we've reached a leaf
      if (!currentClause.children || currentClause.children.length === 0) {
        break;
      }
      
      // If only one child, follow it
      if (currentClause.children.length === 1) {
        currentClauseId = currentClause.children[0];
        path.push(currentClauseId);
        continue;
      }
      
      // Multiple children: use LLM to select
      const childSummaries = currentClause.children.map(childId => {
        const child = clauseMap.get(childId);
        return {
          id: childId,
          number: child.number,
          title: child.title,
          preview: child.content.substring(0, 150),
        };
      });
      
      const prompt = getClauseSelectionPrompt(query, childSummaries);
      const response = await this.invokeWithRetry(prompt);
      const parsed = this.parseSelectionResponse(response.content, childSummaries);
      
      // Validate selected ID
      if (!parsed.selectedId || !clauseMap.has(parsed.selectedId)) {
        console.warn('Invalid child clause selected, stopping traversal');
        break;
      }
      
      // If confidence is low, stop traversal
      if (parsed.confidence < this.confidenceThreshold) {
        break;
      }
      
      currentClauseId = parsed.selectedId;
      path.push(currentClauseId);
    }
    
    return path;
  }

  /**
   * Extract full section content from traversal path
   * @param {Array} path - Array of clause IDs
   * @param {Map} clauseMap - All clauses
   * @returns {Object} Section content with metadata
   */
  extractSectionContent(path, clauseMap) {
    const sections = path.map(id => {
      const clause = clauseMap.get(id);
      return {
        clauseId: id,
        number: clause.number,
        title: clause.title,
        content: clause.content,
        pageNumber: clause.pageNumber,
        level: clause.level,
      };
    });
    
    // Combine content
    const fullContent = sections.map(s => 
      `[Clause ${s.number}: ${s.title}]\n${s.content}`
    ).join('\n\n');
    
    return {
      sections: sections,
      fullContent: fullContent,
      pageNumbers: [...new Set(sections.map(s => s.pageNumber))],
      clauseNumbers: sections.map(s => s.number),
    };
  }

  /**
   * Generate grounded answer from selected section
   * @param {string} query - User query
   * @param {Object} sectionContent - Extracted section content
   * @param {Array} path - Traversal path
   * @returns {Promise<Object>} Answer with confidence
   */
  async generateGroundedAnswer(query, sectionContent, path) {
    try {
      const prompt = getGroundedAnswerPrompt(
        query,
        sectionContent.fullContent,
        sectionContent.clauseNumbers
      );
      
      const response = await this.invokeWithRetry(prompt);
      
      // Parse answer and confidence
      const parsed = this.parseAnswerResponse(response.content);
      
      return {
        text: parsed.answer,
        confidence: parsed.confidence,
        hasAnswer: !parsed.answer.toLowerCase().includes('does not contain'),
      };
    } catch (error) {
      throw new Error(`Answer generation failed: ${error.message}`);
    }
  }

  /**
   * Build citation from traversal path
   * @param {Array} path - Traversal path
   * @param {Object} documentTree - Document tree
   * @returns {Object} Citation object
   */
  buildCitation(path, documentTree) {
    const citations = path.map(id => {
      const clause = documentTree.clauses.get(id);
      return {
        document: documentTree.filename,
        clauseNumber: clause.number,
        clauseTitle: clause.title,
        pageNumber: clause.pageNumber,
        level: clause.level,
        excerpt: clause.content.substring(0, 200) + '...',
      };
    });
    
    return {
      primary: citations[citations.length - 1],  // Most specific clause
      path: citations,  // Full reasoning path
    };
  }

  /**
   * Parse LLM selection response with retry logic
   * @param {string} response - LLM response text
   * @param {Array} clauseSummaries - Available clauses for fallback matching
   * @returns {Object} Parsed selection
   */
  parseSelectionResponse(response, clauseSummaries = []) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      let selectedId = parsed.selected || parsed.selectedId || parsed.clause_id;
      
      // Extract ID from various formats Mistral might return
      if (selectedId) {
        // Format 1: "31. Hours [ID: uuid]" - extract UUID
        const idMatch = selectedId.match(/\[ID:\s*([a-f0-9-]+)\]/i);
        if (idMatch) {
          selectedId = idMatch[1];
        }
        // Format 2: "2.1 Base Salary" or "6.1 Notice Period" or "32. Location" - extract clause number
        else if (!selectedId.includes('-')) {
          // Extract clause number (e.g., "2.1" from "2.1 Base Salary" or "3.2" from "32. Location")
          const numberMatch = selectedId.match(/(\d+\.\d+)/);
          if (numberMatch) {
            const clauseNumber = numberMatch[1];
            // Find matching clause by number
            const match = clauseSummaries.find(c => c.number === clauseNumber);
            if (match) {
              selectedId = match.id;
            }
          }
        }
      }
      
      return {
        selectedId: selectedId,
        reasoning: parsed.reasoning || parsed.reason || '',
        confidence: parseFloat(parsed.confidence) || 0.5,
      };
    } catch (error) {
      console.warn('Failed to parse JSON response, using fallback:', error.message);
      
      // Fallback: Try to extract from text
      const selectedMatch = response.match(/(?:SELECTED|selected|ID):\s*([^\n,}]+)/i);
      const confidenceMatch = response.match(/(?:CONFIDENCE|confidence):\s*([\d.]+)/i);
      
      let selectedId = selectedMatch ? selectedMatch[1].trim() : null;
      
      // Try to extract ID or clause number
      if (selectedId) {
        const idMatch = selectedId.match(/\[ID:\s*([a-f0-9-]+)\]/i);
        if (idMatch) {
          selectedId = idMatch[1];
        } else if (!selectedId.includes('-') && clauseSummaries.length > 0) {
          const numberMatch = selectedId.match(/(\d+\.\d+)/);
          if (numberMatch) {
            const clauseNumber = numberMatch[1];
            const match = clauseSummaries.find(c => c.number === clauseNumber);
            if (match) {
              selectedId = match.id;
            }
          }
        }
      }
      
      return {
        selectedId: selectedId,
        reasoning: 'Fallback parsing used',
        confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5,
      };
    }
  }

  /**
   * Parse LLM answer response with retry logic
   * @param {string} response - LLM response text
   * @returns {Object} Parsed answer
   */
  parseAnswerResponse(response) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        answer: parsed.answer || parsed.response || response,
        confidence: parseFloat(parsed.confidence) || 0.8,
      };
    } catch (error) {
      console.warn('Failed to parse JSON answer, using fallback:', error.message);
      
      // Fallback: Use entire response as answer
      const confidenceMatch = response.match(/(?:CONFIDENCE|confidence):\s*([\d.]+)/i);
      
      return {
        answer: response.replace(/\{[\s\S]*\}/, '').trim() || response,
        confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5,
      };
    }
  }

  /**
   * Invoke LLM with JSON validation and retry
   * @param {string} prompt - Prompt to send
   * @param {number} maxRetries - Maximum retry attempts
   * @returns {Promise<Object>} LLM response
   */
  async invokeWithRetry(prompt, maxRetries = 2) {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await this.llm.invoke(prompt);
        
        // Validate JSON
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          JSON.parse(jsonMatch[0]);  // Validate
          return response;
        }
        
        // If no valid JSON and not last attempt, retry with stricter prompt
        if (attempt < maxRetries - 1) {
          console.warn(`Attempt ${attempt + 1}: Invalid JSON, retrying...`);
          prompt = prompt + '\n\nIMPORTANT: Return ONLY valid JSON. No extra text.';
          continue;
        }
        
        return response;  // Return anyway on last attempt
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries - 1) {
          console.warn(`Attempt ${attempt + 1} failed: ${error.message}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000));  // Wait 1s
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Hybrid fallback: keyword-based search if confidence is low
   * @param {string} query - User query
   * @param {Object} documentTree - Document tree
   * @returns {Promise<Object>} Fallback result
   */
  async hybridFallback(query, documentTree) {
    try {
      // Extract keywords from query
      const keywords = query.toLowerCase().split(/\s+/)
        .filter(word => word.length > 3);
      
      // Search flat index
      const matches = [];
      documentTree.flatIndex.forEach(item => {
        const titleLower = item.title.toLowerCase();
        const matchCount = keywords.filter(kw => titleLower.includes(kw)).length;
        
        if (matchCount > 0) {
          matches.push({
            ...item,
            score: matchCount / keywords.length,
          });
        }
      });
      
      // Sort by score
      matches.sort((a, b) => b.score - a.score);
      
      if (matches.length === 0) {
        return {
          answer: 'The provided documents do not contain this information.',
          confidence: 0,
          reasoning: { method: 'fallback', matches: 0 },
          citation: null,
        };
      }
      
      // Use top match
      const topMatch = matches[0];
      const clause = documentTree.clauses.get(topMatch.clauseId);
      
      // Generate answer from this clause
      const answer = await this.generateGroundedAnswer(
        query,
        {
          fullContent: clause.content,
          clauseNumbers: [clause.number],
        },
        [topMatch.clauseId]
      );
      
      return {
        answer: answer.text,
        confidence: topMatch.score * 0.6,  // Lower confidence for fallback
        reasoning: {
          method: 'keyword_fallback',
          matches: matches.length,
          keywords: keywords,
        },
        citation: {
          primary: {
            document: documentTree.filename,
            clauseNumber: clause.number,
            clauseTitle: clause.title,
            pageNumber: clause.pageNumber,
          },
        },
      };
    } catch (error) {
      throw new Error(`Fallback search failed: ${error.message}`);
    }
  }
}

module.exports = new TreeReasonerService();
