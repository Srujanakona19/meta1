const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const mlRoutes = require('./routes/mlRoutes');
const authRoutes = require('./routes/authRoutes');

// --- Log Interceptor ---
global.logBuffer = [];
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

function captureLog(level, originalFn, ...args) {
  const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  global.logBuffer.unshift({ time, level, msg });
  if (global.logBuffer.length > 100) global.logBuffer.pop();
  originalFn.apply(console, args);
}

console.log = (...args) => captureLog('INFO', originalLog, ...args);
console.warn = (...args) => captureLog('WARNING', originalWarn, ...args);
console.error = (...args) => captureLog('ERROR', originalError, ...args);
// -----------------------

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors({
   origin: [
    'http://localhost',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ]
}));
app.use(express.json());
app.use(morgan('dev')); // API logging

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Node.js Meta-Learned Pipeline Recommender API (10/10 Enterprise Edition)" });
});

app.get('/api/system/logs', (req, res) => {
  res.json(global.logBuffer || []);
});

app.use('/api/auth', authRoutes);
app.use('/api', mlRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ detail: err.message || "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Node.js Backend listening on port ${port}`);
});
