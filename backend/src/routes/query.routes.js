const express = require('express');
const router = express.Router();
const queryController = require('../controllers/query.controller');
const { validateQuery } = require('../middleware/validation.middleware');

router.post('/', validateQuery, queryController.processQuery);

module.exports = router;
