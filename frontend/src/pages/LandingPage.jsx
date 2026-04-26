import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

const FEATURES = [
  { title: "Real-time Monitoring", desc: "Every API call tracked instantly. Zero lag across all endpoints." },
  { title: "Response Analytics", desc: "Pinpoint slow APIs with live charts before users feel it." },
  { title: "Failure Prediction", desc: "Pattern-based alerts before your API actually goes down." },
  { title: "Smart Alerts", desc: "Email alerts the moment error rates spike above threshold." },
  { title: "Live Dashboard", desc: "Auto-refreshing charts — no manual reload ever needed." },
  { title: "Secure by Default", desc: "JWT auth baked in. Your data stays 100% private." },
];

export default function LandingPage({ onLogin }) {
  const { login } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top, behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/signup`, form);
      login(res.data.token, res.data.name, res.data.apiKey);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#05070f", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", color: "#e2e8f0", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }

        .hero-glow { background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 70%); }
        .mesh {
          background-image:
            radial-gradient(at 20% 30%, rgba(99,102,241,0.15) 0px, transparent 50%),
            radial-gradient(at 80% 10%, rgba(236,72,153,0.1) 0px, transparent 50%),
            radial-gradient(at 60% 80%, rgba(34,211,238,0.08) 0px, transparent 50%);
        }

        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .a1 { animation: fadeUp 0.6s 0s both; }
        .a2 { animation: fadeUp 0.6s 0.1s both; }
        .a3 { animation: fadeUp 0.6s 0.2s both; }
        .a4 { animation: fadeUp 0.6s 0.3s both; }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .blink { animation: blink 2s ease-in-out infinite; }

        .pill-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; border: none; border-radius: 10px;
          font-weight: 700; cursor: pointer;
          transition: all 0.2s ease; font-family: inherit;
        }
        .pill-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.45); filter: brightness(1.1); }
        .pill-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .ghost-btn {
          background: transparent; border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8; border-radius: 10px; cursor: pointer;
          transition: all 0.2s; font-family: inherit; font-weight: 600;
        }
        .ghost-btn:hover { border-color: rgba(99,102,241,0.5); color: #a5b4fc; }

        .feat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 24px;
          transition: all 0.25s ease;
        }
        .feat-card:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.2); transform: translateY(-3px); }

        .input-field {
          width: 100%; padding: 11px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #f1f5f9;
          font-size: 14px; outline: none; font-family: inherit;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.05); }
        .input-field::placeholder { color: #334155; }

        .nav-link { color: #475569; font-size: 14px; cursor: pointer; font-weight: 500; transition: color 0.15s; user-select: none; }
        .nav-link:hover { color: #e2e8f0; }

        .tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
          border-radius: 999px; padding: 4px 14px;
          font-size: 12px; font-weight: 600; color: #a5b4fc; letter-spacing: 0.3px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #05070f; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .footer-inner { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
          .nav-inner { padding: 0 20px !important; }
        }
        @media (max-width: 480px) {
          .cta-box { padding: 40px 20px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav-inner" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(5,7,15,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s", padding: "0 40px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "15px", color: "white",
          }}>N</div>
          <span style={{ fontWeight: 800, fontSize: "17px", color: "#f8fafc", letterSpacing: "-0.3px" }}>NexMonitor</span>
        </div>

        <div className="nav-links" style={{ display: "flex", gap: "32px" }}>
          <span className="nav-link" onClick={() => scrollTo("features")}>Features</span>
          <span className="nav-link" onClick={() => scrollTo("signup-form")}>Get Started</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="ghost-btn" onClick={onLogin} style={{ padding: "8px 20px", fontSize: "14px" }}>
            Log in
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none", background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#94a3b8",
              flexDirection: "column", gap: "4px", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ width: "18px", height: "2px", background: "#94a3b8", display: "block" }} />
            <span style={{ width: "18px", height: "2px", background: "#94a3b8", display: "block" }} />
            <span style={{ width: "18px", height: "2px", background: "#94a3b8", display: "block" }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 49,
          background: "rgba(5,7,15,0.97)", borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column", padding: "16px 24px", gap: "16px",
        }}>
          <span className="nav-link" style={{ fontSize: "16px" }} onClick={() => scrollTo("features")}>Features</span>
          <span className="nav-link" style={{ fontSize: "16px" }} onClick={() => scrollTo("signup-form")}>Get Started</span>
        </div>
      )}

      {/* HERO + SIGNUP */}
      <section className="hero-glow mesh" style={{ paddingTop: "100px", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div className="hero-grid" style={{
          maxWidth: "1160px", margin: "0 auto", padding: "0 24px", width: "100%",
          display: "grid", gridTemplateColumns: "1fr 420px", gap: "64px", alignItems: "center",
        }}>
          {/* LEFT */}
          <div>
            <div className="a1 tag" style={{ marginBottom: "24px" }}>
              <span className="blink" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
              Live monitoring · No downtime
            </div>

            <h1 className="a2" style={{ fontSize: "clamp(36px, 5.5vw, 68px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-2px", color: "#f8fafc", marginBottom: "20px" }}>
              Monitor APIs.<br />
              <span className="gradient-text">Predict failures.</span><br />
              Ship faster.
            </h1>

            <p className="a3" style={{ fontSize: "17px", color: "#64748b", lineHeight: 1.75, maxWidth: "480px", marginBottom: "36px" }}>
              NexMonitor tracks every backend API call in real-time,
              surfaces anomalies instantly, and alerts you before your
              users ever feel the impact.
            </p>

            <div className="a4">
              <button className="pill-btn" onClick={() => scrollTo("signup-form")} style={{ padding: "13px 28px", fontSize: "15px" }}>
                Start for free
              </button>
            </div>
          </div>

          {/* SIGNUP FORM */}
          <div id="signup-form" style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px", padding: "36px", backdropFilter: "blur(20px)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.5px", marginBottom: "6px" }}>
                Create your account
              </h2>
              <p style={{ fontSize: "14px", color: "#475569" }}>Free to use · No credit card needed</p>
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "6px", letterSpacing: "0.3px" }}>FULL NAME</label>
                <input className="input-field" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "6px", letterSpacing: "0.3px" }}>EMAIL</label>
                <input className="input-field" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "6px", letterSpacing: "0.3px" }}>PASSWORD</label>
                <input className="input-field" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>

            <button className="pill-btn" onClick={handleSignup} disabled={loading} style={{ width: "100%", padding: "13px", fontSize: "15px" }}>
              {loading ? "Creating account..." : "Get started free"}
            </button>

            <p style={{ textAlign: "center", marginTop: "18px", fontSize: "13px", color: "#334155" }}>
              Already have an account?{" "}
              <span onClick={onLogin} style={{ color: "#818cf8", cursor: "pointer", fontWeight: 600 }}>Sign in</span>
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "40px 24px" }}>
        <div className="stats-grid" style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
          {[
            { v: "99.9%", l: "Uptime SLA" },
            { v: "<1ms", l: "Overhead" },
            { v: "50K+", l: "APIs Monitored" },
            { v: "24/7", l: "Alert Coverage" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px", background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.v}</p>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "4px", fontWeight: 600, letterSpacing: "0.5px" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="tag" style={{ marginBottom: "16px" }}>Everything you need</div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
              Built for production APIs
            </h2>
          </div>
          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
            {FEATURES.map(f => (
              <div key={f.title} className="feat-card">
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f1f5f9", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="cta-box" style={{
          maxWidth: "620px", margin: "0 auto", textAlign: "center",
          background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))",
          border: "1px solid rgba(99,102,241,0.15)", borderRadius: "24px", padding: "60px 40px",
        }}>
          <div className="tag" style={{ marginBottom: "20px" }}>Ready to start?</div>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-1.5px", marginBottom: "14px", lineHeight: 1.1 }}>
            Your APIs deserve<br />
            <span className="gradient-text">better monitoring.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "#475569", marginBottom: "32px", lineHeight: 1.7 }}>
            Start monitoring in minutes. No setup hassle.
          </p>
          <button className="pill-btn" onClick={() => scrollTo("signup-form")} style={{ padding: "14px 32px", fontSize: "15px" }}>
            Get started for free
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 40px" }}>
        <div className="footer-inner" style={{ maxWidth: "1040px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "12px", color: "white" }}>N</div>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#475569" }}>NexMonitor</span>
          </div>
          <p style={{ fontSize: "12px", color: "#334155" }}>© 2026 NexMonitor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}