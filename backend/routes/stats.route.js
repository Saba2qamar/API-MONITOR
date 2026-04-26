const express = require('express');
const router = express.Router();
const ApiLog = require('../models/apiLog.model');

// Each user only sees their own data filtered by apiKey
router.get('/logs', async (req, res) => {
  try {
    const user = req.user;
    const logs = await ApiLog.find({ apiKey: user.apiKey })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const user = req.user;
    const logs = await ApiLog.find({ apiKey: user.apiKey });
    const total = logs.length;
    const errors = logs.filter(l => l.statusCode >= 400).length;
    const avgTime = total > 0
      ? Math.round(logs.reduce((sum, l) => sum + l.responseTime, 0) / total)
      : 0;

    res.json({
      totalRequests: total,
      errorCount: errors,
      errorRate: total > 0 ? ((errors / total) * 100).toFixed(1) : 0,
      avgResponseTime: avgTime,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;