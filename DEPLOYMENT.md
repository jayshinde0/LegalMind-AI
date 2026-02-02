# LegalMind AI - Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6.0+
- OpenAI API key
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# Required: OPENAI_API_KEY, MONGODB_URI

# Create required directories
mkdir uploads vectorstore

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: apt-get install mongodb

# Start MongoDB
mongod --dbpath /path/to/data

# Connection string
MONGODB_URI=mongodb://localhost:27017/legalmind
```

**Option 2: MongoDB Atlas (Cloud)**
```bash
# Sign up at mongodb.com/atlas
# Create free cluster
# Get connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legalmind
```

## Production Deployment

### Environment Variables (Production)

```env
# Backend .env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
OPENAI_API_KEY=your_openai_api_key
LLM_MODEL=gpt-4
EMBEDDING_MODEL=text-embedding-3-small
MAX_FILE_SIZE=10485760
CHUNK_SIZE=500
CHUNK_OVERLAP=50
TOP_K_RESULTS=5
```

### Docker Deployment

**Dockerfile (Backend)**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p uploads vectorstore

EXPOSE 5000

CMD ["node", "src/server.js"]
```

**Dockerfile (Frontend)**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: legalmind

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/legalmind
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/vectorstore:/app/vectorstore
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Deploy to Cloud Platforms

#### Heroku Deployment

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create legalmind-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### AWS Deployment

**Backend (EC2 + MongoDB Atlas)**
```bash
# Launch EC2 instance (t2.medium recommended)
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd backend

# Install dependencies
npm ci --only=production

# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name legalmind-backend

# Setup nginx reverse proxy
sudo apt-get install nginx
# Configure nginx to proxy port 5000
```

**Frontend (S3 + CloudFront)**
```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Configure CloudFront distribution
# Point to S3 bucket
# Enable HTTPS
```

#### DigitalOcean Deployment

```bash
# Create Droplet (Ubuntu 22.04)
# SSH into droplet

# Install Node.js and MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# Clone and setup
git clone your-repo-url
cd legalmind-ai/backend
npm ci --only=production

# Use PM2 for process management
npm install -g pm2
pm2 start src/server.js
pm2 startup
pm2 save
```

### Vercel Deployment (Frontend Only)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel --prod

# Set environment variable
# VITE_API_URL=your_backend_url
```

## Performance Optimization

### Backend Optimization

1. **Enable Compression**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add Caching**
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });
```

3. **Database Indexing**
```javascript
documentSchema.index({ status: 1, uploadedAt: -1 });
```

4. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### Frontend Optimization

1. **Code Splitting**
```javascript
const ChatInterface = lazy(() => import('./components/ChatInterface'));
```

2. **Image Optimization**
- Use WebP format
- Lazy loading
- CDN delivery

3. **Bundle Size Reduction**
```bash
npm run build -- --analyze
```

## Monitoring and Logging

### Backend Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Error Tracking

```bash
# Sentry integration
npm install @sentry/node

# Initialize in server.js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Health Checks

```javascript
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1,
    vectorstore: await vectorStoreService.healthCheck(),
    timestamp: Date.now()
  };
  res.json(health);
});
```

## Security Hardening

### Production Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set secure HTTP headers (helmet.js)
- [ ] Implement rate limiting
- [ ] Enable CORS with whitelist
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Regular security updates
- [ ] Implement API authentication (JWT)
- [ ] Add request logging
- [ ] Set up firewall rules
- [ ] Regular backups

### Helmet.js Configuration

```javascript
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
```

## Backup Strategy

### MongoDB Backup

```bash
# Automated daily backup
mongodump --uri="mongodb://localhost:27017/legalmind" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://localhost:27017/legalmind" /backup/20240101
```

### FAISS Index Backup

```bash
# Backup vectorstore directory
tar -czf vectorstore-backup-$(date +%Y%m%d).tar.gz vectorstore/

# Restore
tar -xzf vectorstore-backup-20240101.tar.gz
```

## Scaling Strategies

### Horizontal Scaling

1. **Load Balancer** (nginx)
```nginx
upstream backend {
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

2. **Shared Vector Store**
- Use network-attached storage
- Or migrate to Pinecone/Weaviate

3. **Database Replication**
- MongoDB replica set
- Read replicas for queries

### Vertical Scaling

- Increase server resources
- Optimize FAISS index
- Use GPU for embeddings (future)

## Cost Optimization

### OpenAI API Costs

- **Embeddings**: ~$0.0001 per 1K tokens
- **GPT-4**: ~$0.03 per 1K tokens
- **Estimated**: $5-20/month for moderate usage

### Infrastructure Costs

- **MongoDB Atlas**: Free tier (512MB)
- **Heroku**: $7/month (Hobby tier)
- **AWS EC2**: $10-30/month (t2.small)
- **DigitalOcean**: $6/month (Basic Droplet)

### Cost Reduction Tips

1. Cache embeddings
2. Use GPT-3.5-turbo for non-critical queries
3. Implement query deduplication
4. Batch processing for uploads
5. Use free tiers where possible
