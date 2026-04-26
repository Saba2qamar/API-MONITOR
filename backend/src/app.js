const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiLogRouter = require('../routes/stats.route');
const loggerMiddleware = require('../middleware/logger');
const authRouter = require('../routes/auth.route');
const authMiddleware = require('../middleware/auth.middleware');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Queue & Circuit Breaker
const { publishToQueue, getCircuitStatus } = require('../queue/producer');
const { startConsumer } = require('../queue/consumer');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(loggerMiddleware);

// Start the consumer when app boots up
startConsumer();

// ── Demo routes (for testing) ──
app.get('/api/products', (req, res) => {
  res.json({ message: 'Products list', data: [] });
});

app.get('/api/users', (req, res) => {
  res.json({ message: 'Users list', data: [] });
});

app.get('/api/payment', (req, res) => {
  setTimeout(() => {
    res.json({ message: 'Payment processed' });
  }, 2500);
});

app.get('/api/orders', (req, res) => {
  res.json({ message: 'Orders list', data: [] });
});

// ── Auth routes ──
app.use('/api/auth', authRouter);

// ── Monitor routes (JWT protected) ──
app.use('/api/monitor', authMiddleware, apiLogRouter);

// ── Ingest route — protected by API Key ──
// Clients send their API hits here
app.post('/ingest', apiKeyAuth, async (req, res) => {
  try {
    const { endpoint, method, statusCode, responseTime } = req.body;

    if (!endpoint || !statusCode || !responseTime) {
      return res.status(400).json({ message: 'endpoint, statusCode, responseTime are required' });
    }

    // Build the log data with the client's apiKey (from middleware)
    const logData = {
      apiKey: req.apiKey,       // Each client is identified by their unique apiKey
      userId: req.userId,
      endpoint,
      method: method || 'GET',
      statusCode,
      responseTime,
      timestamp: new Date().toISOString(),
    };

    // Publish to RabbitMQ queue instead of saving directly to DB
    const published = await publishToQueue(logData);

    if (!published) {
      return res.status(503).json({
        message: 'Service temporarily unavailable. Circuit breaker is OPEN.',
        circuitStatus: getCircuitStatus(),
      });
    }

    res.json({ success: true, message: 'Log queued successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Circuit Breaker status route ──
app.get('/api/circuit-status', authMiddleware, (req, res) => {
  res.json(getCircuitStatus());
});

module.exports = app;