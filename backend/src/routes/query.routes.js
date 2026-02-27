const express = require('express');
const router = express.Router();
const { processQuery, streamQuery, explainReasoning } = require('../controllers/query.controller');
const { validateQuery } = require('../middleware/validation.middleware');

// Standard query endpoint
router.post('/', validateQuery, processQuery);

// Streaming query endpoint (SSE)
router.post('/stream', validateQuery, streamQuery);

// Explain reasoning path
router.post('/explain', validateQuery, explainReasoning);

module.exports = router;
