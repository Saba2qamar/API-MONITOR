const amqp = require('amqplib')
const circuitBreaker = require('../circuitBreaker/circuitBreaker')

const RABBITMQ_URL = 'amqp://localhost'
const QUEUE_NAME = 'api_hits'
const DLQ_NAME = 'api_hits_dlq'

let channel = null
let connection = null

// Connect to RabbitMQ and set up queues
const connect = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL)
    channel = await connection.createChannel()

    // Main queue — where all API hit messages go
    await channel.assertQueue(QUEUE_NAME, {
      durable: true, // Survives RabbitMQ restart
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': DLQ_NAME, // Failed messages go to DLQ
      },
    })

    // Dead Letter Queue — stores messages that failed processing
    await channel.assertQueue(DLQ_NAME, {
      durable: true,
    })

    console.log('[Producer] ✅ Connected to RabbitMQ')
    console.log(`[Producer] Queue: ${QUEUE_NAME} | DLQ: ${DLQ_NAME}`)

    // Handle connection errors
    connection.on('error', (err) => {
      console.error('[Producer] Connection error:', err.message)
      circuitBreaker.onFailure()
      channel = null
      connection = null
    })

    connection.on('close', () => {
      console.warn('[Producer] Connection closed. Reconnecting in 5s...')
      channel = null
      connection = null
      setTimeout(connect, 5000)
    })

  } catch (err) {
    console.error('[Producer] Failed to connect:', err.message)
    circuitBreaker.onFailure()
    // Retry after 5 seconds
    setTimeout(connect, 5000)
  }
}

// Send an API hit message to the queue
const publishToQueue = async (logData) => {
  // Check circuit breaker before attempting to publish
  if (!circuitBreaker.allowRequest()) {
    console.warn('[Producer] ⚠️ Circuit OPEN — message dropped')
    return false
  }

  try {
    if (!channel) {
      console.warn('[Producer] No channel available. Reconnecting...')
      await connect()
    }

    const message = JSON.stringify({
      ...logData,
      timestamp: new Date().toISOString(),
    })

    // Send message to queue — persistent so it survives restarts
    channel.sendToQueue(QUEUE_NAME, Buffer.from(message), {
      persistent: true,
    })

    circuitBreaker.onSuccess()
    console.log(`[Producer] 📤 Message sent | apiKey: ${logData.apiKey} | endpoint: ${logData.endpoint}`)
    return true

  } catch (err) {
    console.error('[Producer] Failed to publish message:', err.message)
    circuitBreaker.onFailure()
    return false
  }
}

// Get current circuit breaker status
const getCircuitStatus = () => circuitBreaker.getStatus()

// Initialize connection on startup
connect()

module.exports = { publishToQueue, getCircuitStatus }