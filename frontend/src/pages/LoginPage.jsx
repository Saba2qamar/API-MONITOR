import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:5000'

export default function LoginPage({ onSwitch, onBack }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill all fields')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/login`, form)
      login(res.data.token, res.data.name, res.data.apiKey)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#05070f',
      display: 'flex',
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .a1{animation:fadeUp 0.5s 0s both}
        .a2{animation:fadeUp 0.5s 0.1s both}
        .a3{animation:fadeUp 0.5s 0.2s both}
        .a4{animation:fadeUp 0.5s 0.3s both}

        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        .blink{animation:blink 2s ease-in-out infinite}

        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }

        .login-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #f1f5f9;
          font-size: 15px;
          outline: none;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .login-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.04);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .login-input::placeholder { color: #1e293b; }

        .sign-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .sign-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.4s ease;
        }
        .sign-btn:hover::before { left: 100%; }
        .sign-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.4); }
        .sign-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .back-btn {
          background: none; border: none;
          color: #334155; font-size: 13px;
          cursor: pointer; font-family: inherit;
          font-weight: 600; transition: color 0.15s;
          display: flex; align-items: center; gap: 6px;
        }
        .back-btn:hover { color: #818cf8; }

        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 999px; padding: 4px 14px;
          font-size: 12px; font-weight: 600; color: #a5b4fc;
        }
      `}</style>

      {/* Background mesh */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          radial-gradient(at 15% 25%, rgba(99,102,241,0.15) 0px, transparent 50%),
          radial-gradient(at 85% 75%, rgba(139,92,246,0.1) 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(236,72,153,0.05) 0px, transparent 60%)
        `
      }} />

      {/* Floating decorative shapes */}
      <div style={{
        position: 'absolute', top: '15%', right: '8%',
        width: '120px', height: '120px', borderRadius: '30px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
        border: '1px solid rgba(99,102,241,0.1)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '5%',
        width: '80px', height: '80px', borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(99,102,241,0.04))',
        border: '1px solid rgba(236,72,153,0.08)',
        animation: 'float 8s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }} />

      {/* LEFT PANEL — Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 64px',
        position: 'relative'
      }}>
        {/* Back button */}
        <button className="back-btn a1" onClick={onBack} style={{ position: 'absolute', top: '36px', left: '40px' }}>
          ← Back to home
        </button>

        {/* Logo */}
        <div className="a1" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '52px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '20px', color: 'white',
            boxShadow: '0 8px 24px rgba(99,102,241,0.3)'
          }}>N</div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#f8fafc', letterSpacing: '-0.3px' }}>
            NexMonitor
          </span>
        </div>

        {/* Headline */}
        <div className="a2" style={{ marginBottom: '16px' }}>
          <div className="tag" style={{ marginBottom: '20px' }}>
            <span className="blink" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block' }} />
            All systems operational
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 4vw, 54px)',
            fontWeight: 800,
            color: '#f8fafc',
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            marginBottom: '16px'
          }}>
            Welcome back.<br />
            <span className="gradient-text">Your APIs missed you.</span>
          </h1>
        </div>

        <p className="a3" style={{
          fontSize: '16px', color: '#475569',
          lineHeight: 1.75, maxWidth: '380px', marginBottom: '44px'
        }}>
          Sign in to access real-time monitoring, live charts,
          and instant alerts for your backend APIs.
        </p>

        {/* Feature checklist */}
        <div className="a4" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '360px' }}>
          {[
            { label: 'Real-time API monitoring', sub: 'Every call tracked instantly' },
            { label: 'Live dashboard & charts', sub: 'Auto-refreshes every 5 seconds' },
            { label: 'Multi-tenant data isolation', sub: 'Your data stays yours only' },
            { label: 'API Key management', sub: 'Unique key for every account' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#818cf8', fontSize: '13px', fontWeight: 700, marginTop: '1px'
              }}>✓</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#cbd5e1', marginBottom: '2px' }}>{f.label}</p>
                <p style={{ fontSize: '12px', color: '#334155' }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="a4" style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
          {[{ v: '50K+', l: 'APIs monitored' }, { v: '99.9%', l: 'Uptime' }, { v: '<1ms', l: 'Overhead' }].map(s => (
            <div key={s.l}>
              <p style={{ fontSize: '20px', fontWeight: 800, background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>{s.v}</p>
              <p style={{ fontSize: '11px', color: '#334155', fontWeight: 600, marginTop: '2px' }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — Login Form */}
      <div style={{
        width: '480px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.015)',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          <div className="a1" style={{ marginBottom: '36px' }}>
            <h2 style={{
              fontSize: '26px', fontWeight: 800,
              color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: '8px'
            }}>Sign in</h2>
            <p style={{ fontSize: '14px', color: '#334155' }}>
              Enter your credentials to continue
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', padding: '12px 16px',
              borderRadius: '10px', fontSize: '13px',
              marginBottom: '20px', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <div className="a2" style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
            <div>
              <label style={{
                display: 'block', fontSize: '11px',
                fontWeight: 700, color: '#475569',
                marginBottom: '8px', letterSpacing: '0.8px', textTransform: 'uppercase'
              }}>Email address</label>
              <input
                className="login-input"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={handleKey}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Password</label>
                <span style={{ fontSize: '12px', color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>Forgot?</span>
              </div>
              <input
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={handleKey}
              />
            </div>
          </div>

          <div className="a3">
            <button className="sign-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in to NexMonitor →'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#334155' }}>
              Don't have an account?{' '}
              <span onClick={onSwitch} style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 700 }}>
                Create one free
              </span>
            </p>
          </div>

          {/* Divider */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            marginTop: '32px', paddingTop: '24px',
            display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {['SSL Secured', 'GDPR Ready', '99.9% Uptime'].map(b => (
                <span key={b} style={{ fontSize: '11px', color: '#1e293b', fontWeight: 600 }}>✓ {b}</span>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#1e293b', lineHeight: 1.6 }}>
              By signing in you agree to our{' '}
              <span style={{ color: '#334155', cursor: 'pointer' }}>Terms</span> &{' '}
              <span style={{ color: '#334155', cursor: 'pointer' }}>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}