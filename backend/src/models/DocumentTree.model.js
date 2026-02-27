const mongoose = require('mongoose');

/**
 * Clause Node Schema - Represents a single clause in the document tree
 */
const ClauseNodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  number: {
    type: String,  // e.g., "2.1", "2.1.3"
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  pageNumber: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,  // 0 = root, 1 = section, 2 = subsection, etc.
    required: true,
  },
  parentId: {
    type: String,
    default: null,
  },
  children: [{
    type: String,  // Array of child clause IDs
  }],
  metadata: {
    startChar: Number,
    endChar: Number,
    wordCount: Number,
    keywords: [String],
  },
});

/**
 * Document Tree Schema - Hierarchical structure of legal document
 */
const DocumentTreeSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
    unique: true,
  },
  filename: {
    type: String,
    required: true,
  },
  rootNodes: [{
    type: String,  // Top-level clause IDs
  }],
  clauses: {
    type: Map,
    of: ClauseNodeSchema,  // Map of clauseId -> ClauseNode
  },
  flatIndex: [{
    clauseId: String,
    number: String,
    title: String,
    level: Number,
    pageNumber: Number,
  }],
  metadata: {
    totalClauses: Number,
    maxDepth: Number,
    documentType: String,  // e.g., "employment_agreement", "contract"
    createdAt: Date,
  },
}, {
  timestamps: true,
});

// Index for fast lookups (removed duplicate documentId index)
DocumentTreeSchema.index({ 'flatIndex.number': 1 });
DocumentTreeSchema.index({ 'flatIndex.title': 'text' });

module.exports = mongoose.model('DocumentTree', DocumentTreeSchema);
