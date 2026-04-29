# NexMonitor — API Monitoring System

A production-grade, multi-tenant API monitoring system that tracks every request across your services in real time. Built to handle high-volume traffic with a message queue, circuit breaker, and a clean analytics dashboard.

Live Demo: [api-monitor-8gl9.vercel.app](https://api-monitor-8gl9.vercel.app)

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB — raw API log storage
- PostgreSQL — aggregated metrics and summaries
- RabbitMQ — message queue for async processing
- JWT — user authentication
- API Key — client-level authentication

**Frontend**
- React + Vite
- Recharts — data visualization
- Multi-tab dashboard (Overview, Analytics, Real-time, Endpoints, Errors)

**SDK**
- nexmonitor-sdk — drop-in Express middleware for client integration

---

## Key Features

- Real-time API monitoring dashboard with response time, error rate, and traffic analytics
- Multi-tenant architecture — each client is isolated by API key, no data mixing
- RabbitMQ message queue handles high-volume traffic without overloading the server
- Circuit Breaker pattern — automatically blocks traffic when downstream services fail
- Dead Letter Queue (DLQ) — failed messages are preserved, not lost
- Dual database strategy — MongoDB for flexible raw storage, PostgreSQL for fast aggregations

---

## SDK Usage

Clients integrate NexMonitor into their own backend with one line:

```bash
npm install nexmonitor-sdk
```

```javascript
const NexMonitor = require('nexmonitor-sdk');
const monitor = new NexMonitor('your-api-key', {
  serverUrl: 'https://your-nexmonitor-server.com'
});
app.use(monitor.track());
```

Every API request is now automatically logged in the NexMonitor dashboard.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- PostgreSQL
- RabbitMQ

### Installation

```bash
git clone https://github.com/Saba2qamar/API-MONITOR.git
cd API-MONITOR
cd backend
npm install
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=api_monitor
PG_PASSWORD=your_postgres_password
PG_PORT=5432
```

### Run

```bash
cd backend
node src/server.js
cd frontend
npm run dev
```

---

## How Multi-Tenancy Works

Every user gets a unique API key on signup. All logs are tagged with that key, so each user only sees their own data. No two clients can access each other's metrics.
