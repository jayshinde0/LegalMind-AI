const Document = require('../models/Document.model');
const treeBuilderService = require('../services/tree-builder.service');
const treeReasonerService = require('../services/tree-reasoner.service');

/**
 * Process query using tree-based reasoning
 */
const processQuery = async (req, res, next) => {
  try {
    const { query, documentId } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required',
      });
    }

    // Get all completed documents if no specific document specified
    let documents;
    if (documentId) {
      documents = await Document.find({ _id: documentId, status: 'completed' });
    } else {
      documents = await Document.find({ status: 'completed' });
    }

    if (documents.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No documents available for querying',
      });
    }

    // For now, query first document (can be extended to multi-document)
    const document = documents[0];
    
    // Get document tree
    let documentTree;
    try {
      documentTree = await treeBuilderService.getDocumentTree(document._id);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: 'Document is still being processed. Please wait a moment and try again.',
      });
    }
    
    // Perform tree-based reasoning
    const result = await treeReasonerService.reasonOverTree(query, documentTree);
    
    // Check confidence threshold
    if (result.confidence < 0.7) {
      console.log('Low confidence, trying hybrid fallback...');
      const fallbackResult = await treeReasonerService.hybridFallback(query, documentTree);
      
      return res.json({
        success: true,
        answer: fallbackResult.answer,
        confidence: fallbackResult.confidence,
        method: 'hybrid_fallback',
        reasoning: fallbackResult.reasoning,
        citation: fallbackResult.citation,
      });
    }
    
    // Return successful result
    res.json({
      success: true,
      answer: result.answer,
      confidence: result.confidence,
      method: 'tree_reasoning',
      reasoning: {
        path: result.reasoning.path,
        explanation: result.reasoning.topLevelReasoning,
      },
      citation: result.citation,
      sources: result.citation.path,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Stream query response (for real-time updates)
 */
const streamQuery = async (req, res, next) => {
  try {
    const { query, documentId } = req.body;

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send progress updates
    const sendProgress = (stage, data) => {
      res.write(`data: ${JSON.stringify({ stage, data })}\n\n`);
    };

    sendProgress('start', { message: 'Starting query processing...' });

    // Get document
    const documents = documentId
      ? await Document.find({ _id: documentId, status: 'completed' })
      : await Document.find({ status: 'completed' });

    if (documents.length === 0) {
      sendProgress('error', { message: 'No documents available' });
      res.end();
      return;
    }

    const document = documents[0];
    sendProgress('document_loaded', { filename: document.originalName });

    // Get tree
    let documentTree;
    try {
      documentTree = await treeBuilderService.getDocumentTree(document._id);
    } catch (error) {
      sendProgress('error', { message: 'Document is still being processed. Please wait and try again.' });
      res.end();
      return;
    }
    
    sendProgress('tree_loaded', { totalClauses: documentTree.metadata.totalClauses });

    // Reason over tree
    sendProgress('reasoning', { message: 'Analyzing document structure...' });
    const result = await treeReasonerService.reasonOverTree(query, documentTree);

    sendProgress('complete', {
      answer: result.answer,
      confidence: result.confidence,
      citation: result.citation,
      reasoning: result.reasoning,
    });

    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ stage: 'error', data: { message: error.message } })}\n\n`);
    res.end();
  }
};

/**
 * Explain reasoning path
 */
const explainReasoning = async (req, res, next) => {
  try {
    const { query, documentId } = req.body;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const documentTree = await treeBuilderService.getDocumentTree(document._id);
    const result = await treeReasonerService.reasonOverTree(query, documentTree);

    res.json({
      success: true,
      explanation: {
        query: query,
        reasoningPath: result.reasoning.path,
        topLevelReasoning: result.reasoning.topLevelReasoning,
        confidence: result.confidence,
        selectedClauses: result.citation.path,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processQuery,
  streamQuery,
  explainReasoning,
};
