const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { MAX_FILE_SIZE, UPLOAD_DIR } = require('../config/constants');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: fileFilter,
});

module.exports = upload;
