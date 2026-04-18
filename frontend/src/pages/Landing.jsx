import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Shield, Zap, ArrowRight, CheckCircle2, ChevronDown, Lock, FileText, Globe, Sparkles, TrendingUp } from 'lucide-react'
import { useWallet } from '../context/WalletContext'

const FEATURES = [
  { icon: Shield,   title: 'Gig Passport',   desc: 'On-chain work identity spanning all your platforms', color: 'var(--primary-light)' },
  { icon: Zap,      title: 'Slump Shield',   desc: 'AI detects income drops 7 days early and activates your cover', color: 'var(--secondary)' },
  { icon: Lock,     title: 'ZK Eligibility', desc: 'Prove you qualify without revealing your income', color: '#818CF8' },
  { icon: FileText, title: 'Instant Claims', desc: 'Submit → verified on-chain → paid, in under 3 minutes', color: '#4ADE80' },
]

const PLATFORMS = ['Swiggy', 'Uber', 'Zomato', 'Blinkit', 'Porter', 'Dunzo', 'Zepto', 'Ola']
const STATS = [
  { value: '23.5M', label: 'Workers by 2030' },
  { value: '₹18K',  label: 'Avg monthly income' },
  { value: '0%',    label: 'Social protection today' },
  { value: '2026',  label: 'India Code SS Act' },
]

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      const num = parseInt(target.replace(/\D/g, ''))
      if (isNaN(num) || num === 0) { setCount(0); return }
      let start = Date.now()
      const animate = () => {
        const p = Math.min((Date.now() - start) / duration, 1)
        setCount(Math.floor(p * num))
        if (p < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{count || target.replace(/\d/g, c => c)}</span>
}

function LiveTicker() {
  const EVENTS = [
    '⚡ Ravi Kumar · Swiggy · ₹1,200 claim approved',
    '🛡 Priya Singh · Uber · Shield activated',
    '✓ Arjun Dev · Passport minted · Polygon',
    '💰 Neha Sharma · ESI eligible · 42 days',
    '⚡ Suresh K · Zomato · ₹800 claim paid',
    '🌟 Meena Rao · Level 2 verified',
  ]
  const [idx, setIdx] = useState(0)
  useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % EVENTS.length), 2500); return () => clearInterval(t) }, [])
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full overflow-hidden"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', maxWidth: '100%' }}>
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
      <AnimatePresence mode="wait">
        <motion.p key={idx}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="mono truncate" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
          {EVENTS[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export default function Landing() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -40])
  const { tryDemoMode, disconnect, isDemoMode } = useWallet()
  const navigate = useNavigate()

  const handleDemoToggle = () => {
    if (isDemoMode) {
      disconnect()
      return
    }
    tryDemoMode()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between gap-3">

          {/* Logo — compact on mobile */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--primary-dim)', border: '1px solid var(--border-brand)' }}>
              <Shield size={12} style={{ color: 'var(--primary-light)' }} />
            </div>
            {/* Full name on sm+, short name on xs */}
            <span className="display font-bold hidden sm:block" style={{ fontSize: 13, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              GigSecure Chain
            </span>
            <span className="display font-bold sm:hidden" style={{ fontSize: 13, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              GigSecure
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="pill pill-brand hidden sm:flex" style={{ fontSize: 10 }}>
              <Sparkles size={8} />Hackathon Demo
            </span>
            <button
              onClick={handleDemoToggle}
              className="btn-press hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-2 display font-semibold"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 12, border: '1px solid var(--border-default)' }}>
              {isDemoMode ? 'Exit Demo' : 'Try Demo'}
            </button>
            <Link to="/dashboard"
              className="btn-press flex items-center gap-1.5 rounded-xl px-3 py-2 display font-bold"
              style={{ background: 'var(--primary)', color: 'white', fontSize: 12, boxShadow: '0 4px 16px rgba(13,148,136,0.3)', whiteSpace: 'nowrap' }}>
              Launch App <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-12">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-40" />

        <motion.div style={{ y: heroY }} className="relative z-10 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex justify-center mb-5">
            <span className="pill pill-brand" style={{ fontSize: 11 }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live on Polygon Amoy · Hackathon Demo
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="display font-bold mb-4 text-balance"
            style={{ fontSize: 'clamp(36px,8vw,64px)', letterSpacing: '-0.04em', lineHeight: 1.05, color: 'var(--text-primary)' }}>
            Your gig work,{' '}
            <span className="shimmer-text">protected.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 mx-auto text-balance"
            style={{ fontSize: 'clamp(15px,3vw,18px)', color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.65, fontFamily: 'DM Sans' }}>
            India's first on-chain social security layer for gig workers. Verifiable identity, AI risk shield, instant benefits — all from your phone.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-6">
            <Link to="/dashboard"
              className="btn-press flex items-center gap-2 px-6 py-3.5 rounded-2xl display font-bold w-full sm:w-auto justify-center"
              style={{ background: 'var(--primary)', color: 'white', fontSize: 15, boxShadow: '0 8px 32px rgba(13,148,136,0.35)' }}>
              Open App <ArrowRight size={16} />
            </Link>
            <button
              onClick={handleDemoToggle}
              className="btn-press flex items-center gap-2 px-6 py-3.5 rounded-2xl display font-semibold w-full sm:w-auto justify-center"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 15, border: '1px solid var(--border-default)' }}>
              {isDemoMode ? 'Exit Demo' : 'Try Demo'} <Sparkles size={16} />
            </button>
            <a href="#features"
              className="btn-press flex items-center gap-2 px-6 py-3.5 rounded-2xl display font-semibold w-full sm:w-auto justify-center"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 15, border: '1px solid var(--border-default)' }}>
              See how it works <ChevronDown size={16} />
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex justify-center">
            <LiveTicker />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="px-5 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <p className="display font-bold mb-1" style={{ fontSize: 'clamp(24px,4vw,36px)', color: 'var(--primary-light)', letterSpacing: '-0.04em' }}>
                <AnimatedCounter target={s.value} />
              </p>
              <p className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-5 py-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <p className="mono mb-2" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>How it works</p>
          <h2 className="display font-bold" style={{ fontSize: 'clamp(24px,5vw,40px)', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Built for workers like you
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card-lift rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="display font-bold mb-2" style={{ fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{f.title}</h3>
              <p className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Platforms ── */}
      <section className="px-5 py-12 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-6">
          <p className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Compatible Platforms</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-2">
          {PLATFORMS.map((p, i) => (
            <motion.span key={p} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="pill" style={{ fontSize: 12, padding: '6px 14px' }}>
              {p}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 py-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative text-center rounded-3xl p-10 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,var(--bg-card),#0A1010)', border: '1px solid var(--border-brand)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 0%,rgba(13,148,136,0.12),transparent)' }} />
          <div className="relative z-10">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl float flex items-center justify-center"
              style={{ background: 'var(--primary-dim)', border: '1px solid var(--border-brand)' }}>
              <Shield size={28} style={{ color: 'var(--primary-light)' }} />
            </div>
            <h2 className="display font-bold mb-3"
              style={{ fontSize: 'clamp(22px,5vw,36px)', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Your work deserves protection
            </h2>
            <p className="mono mb-6 mx-auto"
              style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 400, lineHeight: 1.65 }}>
              Join the infrastructure that's giving India's gig workers the social security they've always deserved.
            </p>
            <Link to="/dashboard"
              className="inline-flex items-center gap-2 btn-press px-8 py-4 rounded-2xl display font-bold"
              style={{ background: 'var(--primary)', color: 'white', fontSize: 15, boxShadow: '0 8px 32px rgba(13,148,136,0.35)' }}>
              Get Started — It's Free <ArrowRight size={16} />
            </Link>
            <p className="mono mt-4" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              Secured by Polygon Amoy · Zero-knowledge proofs · Privacy-first
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-5 py-8 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield size={14} style={{ color: 'var(--primary-light)' }} />
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>GigSecure Chain · 2026</span>
          </div>
          <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            Built for India's Code on Social Security 2020 · Polygon Amoy Testnet
          </p>
        </div>
      </footer>
    </div>
  )
}
