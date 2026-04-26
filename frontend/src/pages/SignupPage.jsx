import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:5000'

const features = [
  { title: 'Real-time Monitoring', desc: 'Every API call tracked instantly' },
  { title: 'Response Time Analytics', desc: 'Slow APIs detected immediately' },
  { title: 'Error Rate Tracking', desc: 'Get alerted before failures happen' },
  { title: 'Live Dashboard', desc: 'Beautiful charts for everything' },
  { title: 'JWT Secured', desc: 'Your data stays yours — secure login' },
  { title: 'Auto Refresh', desc: 'Dashboard updates every 5 seconds' },
]

export default function SignupPage({ onSwitch }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/signup`, form)
      login(res.data.token, res.data.name)
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        maxWidth: '960px',
        width: '100%',
        alignItems: 'center'
      }}>

        {/* LEFT SIDE — Platform Info */}
        <div>
          {/* Logo + Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '10px',
              background: '#6366f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '700', color: 'white'
            }}>N</div>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9' }}>
              NexMonitor
            </span>
          </div>

          {/* Tagline */}
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#f1f5f9',
            lineHeight: '1.3',
            marginBottom: '12px'
          }}>
            Next-gen API<br />
            <span style={{ color: '#6366f1' }}>Monitoring Platform</span>
          </h2>

          <p style={{
            color: '#475569',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '36px'
          }}>
            Monitor your APIs in real-time, predict failures,
            and get alerted before production issues occur.
          </p>

          {/* Features List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '22px', height: '22px',
                  borderRadius: '50%',
                  background: '#1e1b4b',
                  border: '1px solid #6366f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <span style={{ color: '#6366f1', fontSize: '13px', fontWeight: '700' }}>✓</span>
                </div>
                <div>
                  <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                    {f.title}
                  </p>
                  <p style={{ color: '#475569', fontSize: '13px' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom badge */}
          <div style={{
            marginTop: '36px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0f2d1a',
            border: '1px solid #22c55e30',
            borderRadius: '20px',
            padding: '6px 14px'
          }}>
            <div style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e'
            }} />
            <span style={{ color: '#22c55e', fontSize: '13px' }}>
              Free to start — no credit card required
            </span>
          </div>
        </div>

        {/* RIGHT SIDE — Signup Form */}
        <div style={{
          background: '#1a1d27',
          border: '1px solid #2d3148',
          borderRadius: '16px',
          padding: '40px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '6px'
          }}>
            Create your account
          </h3>
          <p style={{ color: '#475569', fontSize: '14px', marginBottom: '28px' }}>
            Get started in 30 seconds
          </p>

          {error && (
            <div style={{
              background: '#2d1515',
              border: '1px solid #ef444430',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={label}>Name</label>
            <input
              style={input}
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={label}>Email</label>
            <input
              style={input}
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={label}>Password</label>
            <input
              style={input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            style={{
              width: '100%',
              padding: '12px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Get started for free'}
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: '20px',
            color: '#475569',
            fontSize: '14px'
          }}>
            Already have an account?{' '}
            <span
              style={{ color: '#6366f1', cursor: 'pointer' }}
              onClick={onSwitch}
            >
              Login
            </span>
          </p>
        </div>

      </div>
    </div>
  )
}

const label = {
  display: 'block',
  fontSize: '13px',
  color: '#94a3b8',
  marginBottom: '8px'
}

const input = {
  width: '100%',
  padding: '10px 14px',
  background: '#0f1117',
  border: '1px solid #2d3148',
  borderRadius: '8px',
  color: '#f1f5f9',
  fontSize: '14px',
  outline: 'none'
}