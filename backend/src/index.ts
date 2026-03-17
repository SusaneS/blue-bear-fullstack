import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import coursesRouter from './routes/courses';
import studentsRouter from './routes/students';
import { getDatabase } from './database';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Rate limiting: 200 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Initialize database
getDatabase();

// Routes
app.use('/api/courses', coursesRouter);
app.use('/api/students', studentsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Maplewood Course Planning API running on port ${PORT}`);
});

export default app;
