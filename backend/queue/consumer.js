const amqp = require('amqplib')
const ApiLog = require('../models/apiLog.model')
const { saveMetric, createDatabase, initDB } = require('../config/postgres')

const RABBITMQ_URL = 'amqp://localhost'
const QUEUE_NAME = 'api_hits'
const DLQ_NAME = 'api_hits_dlq'
const MAX_RETRY = 3

let channel = null
let connection = null

// Connect to RabbitMQ and start consuming messages
const startConsumer = async () => {
  try {
    // Initialize PostgreSQL database and tables first
    await createDatabase()
    await initDB()

    connection = await amqp.connect(RABBITMQ_URL)
    channel = await connection.createChannel()

    // Process one message at a time
    channel.prefetch(1)

    // Main queue
    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': DLQ_NAME,
      },
    })

    // Dead Letter Queue
    await channel.assertQueue(DLQ_NAME, {
      durable: true,
    })

    console.log('[Consumer] ✅ Connected to RabbitMQ')
    console.log(`[Consumer] Listening on queue: ${QUEUE_NAME}`)

    // Start consuming messages from the main queue
    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return

      let logData
      let retryCount = 0

      try {
        logData = JSON.parse(msg.content.toString())
        retryCount = (msg.properties.headers?.['x-retry-count'] || 0)

        console.log(`[Consumer] 📥 Received | apiKey: ${logData.apiKey} | endpoint: ${logData.endpoint}`)

        // 1. Save raw log to MongoDB (source of truth)
        await saveToMongoDB(logData)

        // 2. Save processed metrics to PostgreSQL (aggregates)
        await saveMetric(logData)

        // Acknowledge message — successfully processed
        channel.ack(msg)
        console.log(`[Consumer] ✅ Message processed — saved to MongoDB + PostgreSQL`)

      } catch (err) {
        console.error(`[Consumer] ❌ Failed to process message:`, err.message)

        if (retryCount < MAX_RETRY) {
          // Retry — requeue the message with incremented retry count
          console.warn(`[Consumer] 🔄 Retrying... attempt ${retryCount + 1}/${MAX_RETRY}`)
          channel.nack(msg, false, false)

          // Re-publish with updated retry count
          channel.sendToQueue(QUEUE_NAME, msg.content, {
            persistent: true,
            headers: { 'x-retry-count': retryCount + 1 },
          })
        } else {
          // Max retries reached — send to Dead Letter Queue
          console.error(`[Consumer] 💀 Max retries reached. Sending to DLQ`)
          channel.nack(msg, false, false)
        }
      }
    })

    // Handle connection errors
    connection.on('error', (err) => {
      console.error('[Consumer] Connection error:', err.message)
      channel = null
      connection = null
    })

    connection.on('close', () => {
      console.warn('[Consumer] Connection closed. Reconnecting in 5s...')
      channel = null
      connection = null
      setTimeout(startConsumer, 5000)
    })

  } catch (err) {
    console.error('[Consumer] Failed to start:', err.message)
    setTimeout(startConsumer, 5000)
  }
}

// Save the raw API log to MongoDB
const saveToMongoDB = async (logData) => {
  try {
    const log = new ApiLog({
      apiKey: logData.apiKey,
      endpoint: logData.endpoint,
      method: logData.method,
      statusCode: logData.statusCode,
      responseTime: logData.responseTime,
      timestamp: logData.timestamp || new Date(),
      userId: logData.userId || null,
    })

    await log.save()
    console.log(`[Consumer] 💾 Saved to MongoDB | endpoint: ${logData.endpoint}`)
  } catch (err) {
    console.error('[Consumer] MongoDB save failed:', err.message)
    throw err
  }
}

module.exports = { startConsumer }