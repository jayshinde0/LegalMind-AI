const validateQuery = (req, res, next) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Query is required and must be a string',
    });
  }

  if (query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Query cannot be empty',
    });
  }

  if (query.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Query is too long (max 1000 characters)',
    });
  }

  next();
};

module.exports = {
  validateQuery,
};
