const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing',
  },
  metadata: {
    pages: Number,
    totalClauses: Number,
    maxDepth: Number,
    documentType: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
  error: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Document', documentSchema);
