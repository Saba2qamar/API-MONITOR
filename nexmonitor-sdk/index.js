'use strict';

const http = require('http');
const https = require('https');

class NexMonitor {
  constructor(apiKey, options = {}) {
    if (!apiKey) {
      throw new Error('[NexMonitor] API key is required.');
    }

    this.apiKey = apiKey;
    this.serverUrl = options.serverUrl || 'https://your-nexmonitor-server.com';
    this.debug = options.debug || false;
  }

  // Express/Node.js middleware — app.use(monitor.track())
  track() {
    return (req, res, next) => {
      const startTime = Date.now();

      // When response finishes, log it
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;

        const logData = {
          endpoint: req.originalUrl || req.url,
          method: req.method,
          statusCode: res.statusCode,
          responseTime,
        };

        this._send(logData);
      });

      next();
    };
  }

  // Manual log — monitor.log({ endpoint, method, statusCode, responseTime })
  log(data) {
    if (!data.endpoint || !data.statusCode || !data.responseTime) {
      if (this.debug) {
        console.warn('[NexMonitor] Missing required fields: endpoint, statusCode, responseTime');
      }
      return;
    }
    this._send(data);
  }

  // Internal — send data to NexMonitor server
  _send(data) {
    try {
      const body = JSON.stringify({
        endpoint: data.endpoint,
        method: data.method || 'GET',
        statusCode: data.statusCode,
        responseTime: data.responseTime,
      });

      const url = new URL(`${this.serverUrl}/ingest`);
      const isHttps = url.protocol === 'https:';
      const lib = isHttps ? https : http;

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'x-api-key': this.apiKey,
        },
      };

      const reqHttp = lib.request(options, (res) => {
        if (this.debug) {
          console.log(`[NexMonitor] Log sent — status: ${res.statusCode}`);
        }
      });

      reqHttp.on('error', (err) => {
        if (this.debug) {
          console.error('[NexMonitor] Failed to send log:', err.message);
        }
      });

      reqHttp.write(body);
      reqHttp.end();
    } catch (err) {
      if (this.debug) {
        console.error('[NexMonitor] Error:', err.message);
      }
    }
  }
}

module.exports = NexMonitor;