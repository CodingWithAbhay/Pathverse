import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load environmental variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware (HTTP Headers Protection)
app.use(helmet());

// CORS configuration supporting dynamic allowed origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];

app.use(cors({
  origin: (origin, callback) => {
    // Allow guest requests with no origin (like server-to-server or Postman tool queries)
    if (!origin) return callback(null, true);

    // Check if origin matches allowed domains
    const isAllowed = allowedOrigins.some(domain => {
      // Direct string comparison or domain match helpers
      return domain.trim() === origin || domain.trim() === '*';
    });

    if (isAllowed) {
      return callback(null, true);
    } else {
      const msg = `CORS Policy: Access from Origin '${origin}' is not allowed by this server configuration.`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configure JSON and URL-encoded body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Backend Running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/resume', resumeRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Pathverse API is running"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Cannot ${req.method} ${req.url}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Internal Error Log]', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message
  });
});

app.listen(PORT, () => {
  console.log(`[Pathvexa Server] Running on http://localhost:${PORT}`);
});