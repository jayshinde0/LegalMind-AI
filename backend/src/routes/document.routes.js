const express = require('express');
const router = express.Router();
const { 
  uploadDocument, 
  getDocuments, 
  getDocumentTree,
  deleteDocument 
} = require('../controllers/document.controller');
const upload = require('../middleware/upload.middleware');

// Upload document
router.post('/upload', upload.single('document'), uploadDocument);

// Get all documents
router.get('/', getDocuments);

// Get document tree structure
router.get('/:id/tree', getDocumentTree);

// Delete document
router.delete('/:id', deleteDocument);

module.exports = router;
