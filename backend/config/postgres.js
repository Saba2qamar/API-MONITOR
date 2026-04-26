const { Pool } = require('pg')

// PostgreSQL connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '2fc2f9f5ed874803820365ede31e6892',
  database: 'api_monitor',
})

// Create tables if they don't exist
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS api_metrics (
        id SERIAL PRIMARY KEY,
        api_key VARCHAR(255) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        method VARCHAR(10) NOT NULL,
        status_code INTEGER NOT NULL,
        response_time INTEGER NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS api_summary (
        id SERIAL PRIMARY KEY,
        api_key VARCHAR(255) UNIQUE NOT NULL,
        total_requests INTEGER DEFAULT 0,
        total_errors INTEGER DEFAULT 0,
        avg_response_time FLOAT DEFAULT 0,
        last_updated TIMESTAMPTZ DEFAULT NOW()
      );
    `)

    console.log('[PostgreSQL]  Connected and tables ready')
  } catch (err) {
    console.error('[PostgreSQL]  Init failed:', err.message)
  }
}

// Create the database if it doesn't exist
const createDatabase = async () => {
  const tempPool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '2fc2f9f5ed874803820365ede31e6892',
    database: 'postgres', // Connect to default DB first
  })

  try {
    const result = await tempPool.query(
      `SELECT 1 FROM pg_database WHERE datname = 'api_monitor'`
    )

    if (result.rowCount === 0) {
      await tempPool.query('CREATE DATABASE api_monitor')
      console.log('[PostgreSQL]  Database api_monitor created')
    } else {
      console.log('[PostgreSQL]  Database api_monitor already exists')
    }
  } catch (err) {
    console.error('[PostgreSQL]  Database creation failed:', err.message)
  } finally {
    await tempPool.end()
  }
}

// Save a single API hit to PostgreSQL
const saveMetric = async (logData) => {
  try {
    // Save raw metric
    await pool.query(
      `INSERT INTO api_metrics (api_key, endpoint, method, status_code, response_time, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        logData.apiKey,
        logData.endpoint,
        logData.method,
        logData.statusCode,
        logData.responseTime,
        logData.timestamp || new Date(),
      ]
    )

    // Update summary for this apiKey
    await pool.query(
      `INSERT INTO api_summary (api_key, total_requests, total_errors, avg_response_time, last_updated)
       VALUES ($1, 1, $2, $3, NOW())
       ON CONFLICT (api_key) DO UPDATE SET
         total_requests = api_summary.total_requests + 1,
         total_errors = api_summary.total_errors + $2,
         avg_response_time = (api_summary.avg_response_time * api_summary.total_requests + $3) / (api_summary.total_requests + 1),
         last_updated = NOW()`,
      [
        logData.apiKey,
        logData.statusCode >= 400 ? 1 : 0,
        logData.responseTime,
      ]
    )

    console.log(`[PostgreSQL]  Metric saved | endpoint: ${logData.endpoint}`)
  } catch (err) {
    console.error('[PostgreSQL] Save failed:', err.message)
    throw err
  }
}

module.exports = { pool, initDB, createDatabase, saveMetric }