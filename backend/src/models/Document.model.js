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
  totalChunks: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing',
  },
  vectorStoreId: {
    type: String,
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
});

module.exports = mongoose.model('Document', documentSchema);
