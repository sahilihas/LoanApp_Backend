import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './db/connectDB.js';
import loanFormRoutes from './routes/loanForm.routes.js';

dotenv.config();

const app = express();

connectDb();

// MIDDLEWARE
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`\n📨 ${req.method} ${req.path}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(
        '📦 Body:', 
        JSON.stringify(req.body, null, 2).substring(0, 200)
      );
    }
    next();
  });
}

// ROUTES
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '🏦 Springfield Financial Services - Backend API',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString(),
    endpoints: {
      applications: {
        create: 'POST /api/loan-forms',
        getAll: 'GET /api/loan-forms',
        getById: 'GET /api/loan-forms/:id',
        updateStatus: 'PUT /api/loan-forms/:id/status',
        delete: 'DELETE /api/loan-forms/:id',
        statistics: 'GET /api/loan-forms/stats'
      }
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

app.use('/api/loan-forms', loanFormRoutes);

// ERROR HANDLING
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('\n=================================');
  console.log('🚀 SERVER STARTED SUCCESSFULLY');
  console.log('=================================');
  console.log(`🔗 Server: http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/loan-forms`);
  console.log('=================================\n');
});

process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err.message);
  process.exit(1);
});