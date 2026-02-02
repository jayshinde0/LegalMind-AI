module.exports = {
  CHUNK_SIZE: parseInt(process.env.CHUNK_SIZE) || 500,
  CHUNK_OVERLAP: parseInt(process.env.CHUNK_OVERLAP) || 50,
  TOP_K_RESULTS: parseInt(process.env.TOP_K_RESULTS) || 5,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  VECTORSTORE_DIR: process.env.VECTORSTORE_DIR || './vectorstore',
};
