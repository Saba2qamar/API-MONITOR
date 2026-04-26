import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

const API = 'http://localhost:5000'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [logs, setLogs] = useState([])
  const [summary, setSummary] = useState(null)
  const [lastUpdated, setLastUpdated] = useState('')
  const [activeNav, setActiveNav] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // ✅ fetchData useEffect ke BAHAR hai — Refresh button ke liye bhi kaam karega
  const fetchData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const headers = { Authorization: `Bearer ${user.token}` }
      const [logsRes, summaryRes] = await Promise.all([
        axios.get(`${API}/api/monitor/logs`, { headers }),
        axios.get(`${API}/api/monitor/summary`, { headers })
      ])
      setLogs(logsRes.data)
      setSummary(summaryRes.data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsRefreshing(false)
    }
  }, [user.token])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.apiKey || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const chartData = [...logs].reverse().map(log => ({
    name: log.endpoint.replace('/api/', ''),
    time: log.responseTime,
  }))

  const endpointData = Object.entries(
    logs.reduce((acc, l) => {
      const key = l.endpoint.replace('/api/', '')
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  ).map(([name, count]) => ({ name, count }))

  const successCount = logs.filter(l => l.statusCode < 400).length
  const errorCount = logs.filter(l => l.statusCode >= 400).length
  const successRate = logs.length > 0 ? ((successCount / logs.length) * 100).toFixed(1) : '0.0'
  const uniqueEndpoints = new Set(logs.map(l => l.endpoint)).size

  const pieData = [
    { name: '2xx Success', value: logs.filter(l => l.statusCode < 300).length, color: '#22c55e' },
    { name: '4xx Client', value: logs.filter(l => l.statusCode >= 400 && l.statusCode < 500).length, color: '#f59e0b' },
    { name: '5xx Server', value: logs.filter(l => l.statusCode >= 500).length, color: '#ef4444' },
  ].filter(d => d.value > 0)

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '⊞' },
    { id: 'analytics', label: 'Analytics', icon: '↗' },
    { id: 'realtime', label: 'Real-time', icon: '◉' },
    { id: 'endpoints', label: 'Endpoints', icon: '⊛' },
    { id: 'errors', label: 'Errors', icon: '⚠' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117' }}>

      {/* Sidebar */}
      <div style={{
        width: '220px',
        background: '#0d0f18',
        borderRight: '1px solid #1e2235',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0,
        height: '100vh',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e2235' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: '#6366f1',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', color: 'white', fontWeight: '700'
            }}>N</div>
            <div>
              <p style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600', margin: 0 }}>NexMonitor</p>
              <p style={{ color: '#334155', fontSize: '11px', margin: 0 }}>API Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ padding: '12px 8px', flex: 1 }}>
          {navItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '2px',
                background: activeNav === item.id ? '#1a1d27' : 'transparent',
                color: activeNav === item.id ? '#f1f5f9' : '#475569',
                fontSize: '14px',
                borderLeft: activeNav === item.id ? '3px solid #6366f1' : '3px solid transparent',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid #1e2235' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{user?.name}</p>
            <button onClick={logout} style={{
              background: 'transparent', border: '1px solid #1e2235',
              borderRadius: '6px', color: '#475569',
              fontSize: '12px', padding: '5px 10px', cursor: 'pointer'
            }}>Logout</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '220px', flex: 1, padding: '28px 32px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', position: 'relative', zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#f1f5f9', margin: 0 }}>
              {navItems.find(n => n.id === activeNav)?.label}
            </h1>
            <p style={{ color: '#475569', fontSize: '13px', margin: '2px 0 0' }}>Last updated: {lastUpdated}</p>
          </div>

          {/* ✅ Refresh button — ab kaam karega, spinning animation bhi */}
          <button
            onClick={fetchData}
            disabled={isRefreshing}
            style={{
              background: '#1a1d27', border: '1px solid #2d3148',
              borderRadius: '8px', padding: '8px 16px',
              fontSize: '13px', color: isRefreshing ? '#6366f1' : '#94a3b8',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'color 0.2s',
            }}
          >
            <span style={{
              display: 'inline-block',
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
            }}>↻</span>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        {/* OVERVIEW TAB */}
        {activeNav === 'overview' && (
          <div>
            {/* 6 Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <StatCard title="Total Hits" value={summary?.totalRequests ?? 0} sub="Last 24 hours" color="#6366f1" bg="#1e1b4b" />
              <StatCard title="Average Latency" value={(summary?.avgResponseTime ?? 0) + ' ms'} sub="Response time" color="#0ea5e9" bg="#0c2841" />
              <StatCard title="Error Rate" value={(summary?.errorRate ?? 0) + '%'} sub={`${summary?.errorCount ?? 0} errors`} color="#ef4444" bg="#2d1515" />
              <StatCard title="Success Rate" value={successRate + '%'} sub={`${successCount} success`} color="#22c55e" bg="#0f2d1a" />
              <StatCard title="Unique Endpoints" value={uniqueEndpoints} sub="API endpoints" color="#f59e0b" bg="#2d2008" />
              <StatCard title="Total Logs" value={logs.length} sub="Records stored" color="#8b5cf6" bg="#1e1535" />
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={card}>
                <h3 style={cardTitle}>API Traffic Trends</h3>
                <p style={{ color: '#334155', fontSize: '12px', marginTop: '-12px', marginBottom: '16px' }}>Request volume over time</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2235" />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                    <YAxis stroke="#475569" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2d3148', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#e2e8f0' }} formatter={(val) => [val + 'ms', 'Response Time']} />
                    <Area type="monotone" dataKey="time" stroke="#6366f1" strokeWidth={2} fill="url(#colorTime)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={card}>
                <h3 style={cardTitle}>Status Code Distribution</h3>
                <p style={{ color: '#334155', fontSize: '12px', marginTop: '-12px', marginBottom: '16px' }}>HTTP status breakdown</p>
                {pieData.length > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2d3148', borderRadius: '8px', fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex: 1 }}>
                      {pieData.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                          <span style={{ fontSize: '13px', color: '#64748b' }}>{item.name}</span>
                          <span style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: '14px' }}>No data yet</div>
                )}
              </div>
            </div>

            <LogsTable logs={logs} />

            {/* API Key */}
            <div style={{ ...card, marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#475569', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your API Key</p>
                <p style={{ fontFamily: 'monospace', fontSize: '13px', color: '#a5b4fc', margin: 0 }}>{user?.apiKey}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <code style={{ fontSize: '12px', color: '#6366f1', background: '#1e1b4b', padding: '6px 12px', borderRadius: '6px' }}>
                  x-api-key: {user?.apiKey?.slice(0, 18)}...
                </code>
                <button onClick={handleCopy} style={{
                  padding: '8px 16px',
                  background: copied ? '#0f2d1a' : '#1e1b4b',
                  border: `1px solid ${copied ? '#22c55e40' : '#6366f140'}`,
                  borderRadius: '8px', color: copied ? '#22c55e' : '#a5b4fc',
                  fontSize: '13px', cursor: 'pointer'
                }}>
                  {copied ? 'Copied!' : 'Copy Key'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeNav === 'analytics' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={card}>
                <h3 style={cardTitle}>Response Time Trend</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorTime2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2235" />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                    <YAxis stroke="#475569" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2d3148', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#e2e8f0' }} formatter={(val) => [val + 'ms', 'Response Time']} />
                    <Area type="monotone" dataKey="time" stroke="#0ea5e9" strokeWidth={2} fill="url(#colorTime2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={card}>
                <h3 style={cardTitle}>Requests Per Endpoint</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={endpointData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2235" />
                    <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                    <YAxis stroke="#475569" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#1a1d27', border: '1px solid #2d3148', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#e2e8f0' }} />
                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* REALTIME TAB */}
        {activeNav === 'realtime' && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              <h3 style={{ ...cardTitle, margin: 0 }}>Live Feed</h3>
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#475569' }}>Auto-refreshes every 5s</span>
            </div>
            <LogsTable logs={logs.slice(0, 10)} noCard />
          </div>
        )}

        {/* ENDPOINTS TAB */}
        {activeNav === 'endpoints' && (
          <div style={card}>
            <h3 style={{ ...cardTitle, marginBottom: '20px' }}>Endpoint Summary</h3>
            {endpointData.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#334155' }}>No endpoints tracked yet</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2d3148' }}>
                    <th style={th}>Endpoint</th>
                    <th style={th}>Requests</th>
                    <th style={th}>Errors</th>
                    <th style={th}>Avg Response</th>
                    <th style={th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {endpointData.map((ep, i) => {
                    const epLogs = logs.filter(l => l.endpoint.replace('/api/', '') === ep.name)
                    const epErrors = epLogs.filter(l => l.statusCode >= 400).length
                    const epAvg = epLogs.length > 0 ? Math.round(epLogs.reduce((s, l) => s + l.responseTime, 0) / epLogs.length) : 0
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #1e2235' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1e2235'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={td}><code style={{ background: '#1e1b4b', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', color: '#a5b4fc' }}>/api/{ep.name}</code></td>
                        <td style={td}><span style={{ color: '#e2e8f0' }}>{ep.count}</span></td>
                        <td style={td}><span style={{ color: epErrors > 0 ? '#ef4444' : '#22c55e' }}>{epErrors}</span></td>
                        <td style={td}><span style={{ color: epAvg > 2000 ? '#f59e0b' : '#22c55e' }}>{epAvg}ms</span></td>
                        <td style={td}>
                          <span style={{ background: epErrors === 0 ? '#0f2d1a' : '#2d1515', color: epErrors === 0 ? '#22c55e' : '#ef4444', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                            {epErrors === 0 ? 'Healthy' : 'Issues'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ERRORS TAB */}
        {activeNav === 'errors' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <StatCard title="Total Errors" value={errorCount} sub="All time" color="#ef4444" bg="#2d1515" />
              <StatCard title="Error Rate" value={(summary?.errorRate ?? 0) + '%'} sub="Of all requests" color="#f59e0b" bg="#2d2008" />
              <StatCard title="Success Rate" value={successRate + '%'} sub="Healthy requests" color="#22c55e" bg="#0f2d1a" />
            </div>
            <LogsTable logs={logs.filter(l => l.statusCode >= 400)} />
          </div>
        )}

      </div>
    </div>
  )
}

function LogsTable({ logs, noCard }) {
  const content = (
    <>
      {!noCard && <h3 style={{ ...cardTitle, marginBottom: '16px' }}>Recent API Logs</h3>}
      {logs.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '14px' }}>No logs yet</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2d3148' }}>
              <th style={th}>Endpoint</th>
              <th style={th}>Method</th>
              <th style={th}>Status</th>
              <th style={th}>Response Time</th>
              <th style={th}>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id} style={{ borderBottom: '1px solid #1e2235' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1e2235'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={td}><span style={{ background: '#1e2235', padding: '3px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px', color: '#a5b4fc' }}>{log.endpoint}</span></td>
                <td style={td}><span style={{ background: '#0f2d1a', color: '#22c55e', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>{log.method}</span></td>
                <td style={td}>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: log.statusCode >= 400 ? '#2d1515' : '#0f2d1a', color: log.statusCode >= 400 ? '#ef4444' : '#22c55e' }}>
                    {log.statusCode}
                  </span>
                </td>
                <td style={td}><span style={{ color: log.responseTime > 2000 ? '#f59e0b' : '#22c55e', fontWeight: '500' }}>{log.responseTime}ms</span></td>
                <td style={{ ...td, color: '#475569', fontSize: '12px' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
  if (noCard) return content
  return <div style={card}>{content}</div>
}

function StatCard({ title, value, sub, color, bg }) {
  return (
    <div style={{ background: bg, borderRadius: '12px', padding: '20px 24px', border: `1px solid ${color}20` }}>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px', margin: '0 0 8px' }}>{title}</p>
      <p style={{ color: color, fontSize: '28px', fontWeight: '600', margin: '0 0 4px' }}>{value}</p>
      <p style={{ color: '#334155', fontSize: '12px', margin: 0 }}>{sub}</p>
    </div>
  )
}

const card = { background: '#1a1d27', borderRadius: '12px', padding: '24px', border: '1px solid #2d3148' }
const cardTitle = { fontSize: '15px', fontWeight: '500', color: '#94a3b8', margin: '0 0 20px' }
const th = { padding: '10px 16px', textAlign: 'left', fontSize: '12px', color: '#475569', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }
const td = { padding: '12px 16px', fontSize: '14px', color: '#e2e8f0' }