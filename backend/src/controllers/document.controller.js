const Document = require('../models/Document.model');
const pdfService = require('../services/pdf.service');
const chunkingService = require('../services/chunking.service');
const vectorStoreService = require('../services/vectorstore.service');

class DocumentController {
  async uploadDocument(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const document = new Document({
        filename: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        status: 'processing',
      });

      await document.save();

      res.status(202).json({
        success: true,
        message: 'Document uploaded and processing started',
        documentId: document._id,
        filename: document.originalName,
      });

      this.processDocument(document).catch((error) => {
        console.error('Background processing error:', error);
      });
    } catch (error) {
      next(error);
    }
  }

  async processDocument(document) {
    try {
      const { text } = await pdfService.extractText(document.filePath);
      const cleanedText = pdfService.cleanText(text);

      const chunks = await chunkingService.chunkLegalDocument(
        cleanedText,
        document.originalName
      );

      await vectorStoreService.addDocuments(chunks);

      document.status = 'completed';
      document.totalChunks = chunks.length;
      document.processedAt = new Date();
      await document.save();

      console.log(`Document processed: ${document.originalName} (${chunks.length} chunks)`);
    } catch (error) {
      document.status = 'failed';
      document.error = error.message;
      await document.save();
      console.error(`Document processing failed: ${error.message}`);
    }
  }

  async getDocuments(req, res, next) {
    try {
      const documents = await Document.find()
        .select('-filePath')
        .sort({ uploadedAt: -1 });

      res.json({
        success: true,
        count: documents.length,
        documents: documents,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocumentStatus(req, res, next) {
    try {
      const document = await Document.findById(req.params.id).select('-filePath');

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found',
        });
      }

      res.json({
        success: true,
        document: document,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req, res, next) {
    try {
      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found',
        });
      }

      await vectorStoreService.deleteBySource(document.originalName);
      await document.deleteOne();

      res.json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DocumentController();
