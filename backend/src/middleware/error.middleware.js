const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds the limit of 10MB',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  }

  if (err.message.includes('Only PDF files')) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
