require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const vectorStoreService = require('./services/vectorstore.service');
const errorHandler = require('./middleware/error.middleware');
const documentRoutes = require('./routes/document.routes');
const queryRoutes = require('./routes/query.routes');
const fs = require('fs').promises;
const { UPLOAD_DIR, VECTORSTORE_DIR } = require('./config/constants');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initializeApp = async () => {
  try {
    await connectDB();
    
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(VECTORSTORE_DIR, { recursive: true });
    
    await vectorStoreService.initialize();
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/documents', documentRoutes);
app.use('/api/query', queryRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

initializeApp().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;
