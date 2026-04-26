const ApiLog = require('../models/apiLog.model');

const loggerMiddleware = async (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', async () => {
    const responseTime = Date.now() - startTime;

    if (
      req.path.startsWith('/api/') &&
      !req.path.startsWith('/api/monitor') &&
      !req.path.startsWith('/api/auth') &&
      req.userId
    ) {
      try {
        await ApiLog.create({
          userId: req.userId,
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          responseTime: responseTime,
        });
      } catch (err) {
        console.error('Log save error:', err.message);
      }
    }
  });

  next();
};

module.exports = loggerMiddleware;