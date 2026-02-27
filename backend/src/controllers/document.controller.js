const Document = require('../models/Document.model');
const pdfService = require('../services/pdf.service');
const treeBuilderService = require('../services/tree-builder.service');

/**
 * Upload and process document
 */
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    // Create document record
    const document = await Document.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      status: 'processing',
    });

    // Return immediate response
    res.json({
      success: true,
      document: {
        _id: document._id,
        filename: document.filename,
        originalName: document.originalName,
        status: document.status,
        uploadDate: document.createdAt,
      },
    });

    // Process in background
    processDocumentBackground(document._id, req.file.path, req.file.originalname);
  } catch (error) {
    next(error);
  }
};

/**
 * Background processing - Build document tree
 */
const processDocumentBackground = async (documentId, filepath, filename) => {
  try {
    console.log(`Processing document: ${filename}`);
    
    // Step 1: Extract text from PDF
    const pdfData = await pdfService.extractText(filepath);
    const text = pdfData.text;
    console.log(`Extracted ${text.length} characters from ${pdfData.numPages} pages`);
    
    // Step 2: Build hierarchical tree structure
    const documentTree = await treeBuilderService.buildDocumentTree(
      text,
      filename,
      documentId
    );
    console.log(`Built tree with ${documentTree.metadata.totalClauses} clauses`);
    
    // Step 3: Update document status
    await Document.findByIdAndUpdate(documentId, {
      status: 'completed',
      processedAt: new Date(),
      metadata: {
        pages: pdfData.numPages,
        totalClauses: documentTree.metadata.totalClauses,
        maxDepth: documentTree.metadata.maxDepth,
        documentType: documentTree.metadata.documentType,
      },
    });
    
    console.log(`Document processing completed: ${filename}`);
  } catch (error) {
    console.error(`Document processing failed: ${error.message}`);
    
    await Document.findByIdAndUpdate(documentId, {
      status: 'failed',
      error: error.message,
    });
  }
};

/**
 * Get all documents
 */
const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find()
      .select('filename originalName status metadata createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      documents: documents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get document tree structure
 */
const getDocumentTree = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const tree = await treeBuilderService.getDocumentTree(id);
    
    // Convert Map to object for JSON response
    const clausesObj = {};
    tree.clauses.forEach((value, key) => {
      clausesObj[key] = value;
    });
    
    res.json({
      success: true,
      tree: {
        documentId: tree.documentId,
        filename: tree.filename,
        rootNodes: tree.rootNodes,
        clauses: clausesObj,
        flatIndex: tree.flatIndex,
        metadata: tree.metadata,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete document and its tree
 */
const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete document tree
    await treeBuilderService.deleteDocumentTree(id);
    
    // Delete document record
    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
      });
    }

    // Delete physical file
    const fs = require('fs').promises;
    try {
      await fs.unlink(document.filePath);
    } catch (err) {
      console.error('Failed to delete file:', err);
    }

    res.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentTree,
  deleteDocument,
};
