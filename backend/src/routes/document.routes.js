const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const upload = require('../middleware/upload.middleware');

router.post('/upload', upload.single('document'), documentController.uploadDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentStatus);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
