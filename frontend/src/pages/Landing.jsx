import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Building2,
  Trophy,
  Code2,
  HeartHandshake,
  MonitorSmartphone,
  X,
  Timer,
} from 'lucide-react'

const PILLARS = [
  {
    title: 'Innovation · 25%',
    desc: 'Live Groq copilots + Kannada voice guidance convert static dashboards into real-time Bengaluru operations.',
    icon: Trophy,
    color: '#F59E0B',
  },
  {
    title: 'Technical Execution · 25%',
    desc: 'Streaming AI, multimodal verification, and motion-rich analytics keep the demo reliable under judge pressure.',
    icon: Code2,
    color: '#14B8A6',
  },
  {
    title: 'Impact & Practicality · 25%',
    desc: 'Designed for Bengaluru congestion, gig-worker route friction, and city-level workforce balancing.',
    icon: HeartHandshake,
    color: '#22C55E',
  },
  {
    title: 'Presentation & UX · 25%',
    desc: 'City-first demo path, mobile-first UI, and clear action summaries for fast judging confidence.',
    icon: MonitorSmartphone,
    color: '#60A5FA',
  },
]

const MODULES = [
  {
    title: 'SlumpShield',
    desc: 'Interactive SVG risk arc + one-tap optimizer route simulation.',
    route: '/slump-shield',
    icon: Zap,
    color: '#F59E0B',
  },
  {
    title: 'City Intelligence',
    desc: 'Live worker-density drift with hourly pressure bars.',
    route: '/city',
    icon: Building2,
    color: '#14B8A6',
  },
  {
    title: 'Gig Passport',
    desc: 'Portable identity with expandable work-history proof and badge trust signals.',
    route: '/passport',
    icon: Shield,
    color: '#60A5FA',
  },
]

const DEMO_STEPS = [
  {
    step: '01',
    title: 'Open City Intelligence',
    detail: 'Ask the AI operator console about 8pm demand and show zone-level recommendations.',
    route: '/city',
  },
  {
    step: '02',
    title: 'Switch to SlumpShield',
    detail: 'Move risk slider and trigger AI risk explainer + optimizer guidance with Kannada voice.',
    route: '/slump-shield',
  },
  {
    step: '03',
    title: 'Finish at Gig Passport',
    detail: 'Expand work history and explain trust portability for workers.',
    route: '/passport',
  },
]

export default function Landing() {
  const [judgeMode, setJudgeMode] = useState(false)

  const scoreSignal = useMemo(() => {
    return PILLARS.reduce((sum, item) => sum + Number(item.title.split('%')[0].split('· ')[1]), 0)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-base)' }}>
      <section className="relative min-h-screen px-4 pt-10 pb-24 sm:px-6">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-35" />
        <div
          className="absolute -top-24 -left-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15), transparent 65%)' }}
        />
        <div
          className="absolute -bottom-16 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.18), transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="pill pill-brand inline-flex mb-4" style={{ fontSize: 10 }}>
              <Sparkles size={10} /> BrinHack 1.0 Final Demo Build
            </span>

            <h1
              className="display font-bold"
              style={{
                fontSize: 'clamp(34px, 10vw, 68px)',
                letterSpacing: '-0.05em',
                lineHeight: 1.02,
                color: 'var(--text-primary)',
              }}
            >
              BengaluruFlow is now a
              <br />
              <span className="shimmer-text">judge-first experience</span>
            </h1>

            <p
              className="mono mx-auto mt-4"
              style={{
                maxWidth: 700,
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
              }}
            >
              Bengaluru faces peak-hour demand spikes, route congestion, and fragile worker earnings. BengaluruFlow gives BBMP operators and workers a shared AI layer to route labor, reduce congestion, and improve daily income resilience.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="pill pill-success">Score Coverage {scoreSignal}%</span>
              <span className="pill"><Timer size={10} /> 90-sec judge route</span>
              <span className="pill">Mobile-first demo</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mt-7"
          >
            <Link
              to="/dashboard"
              className="btn-press px-6 py-3 rounded-2xl display font-bold"
              style={{
                background: 'var(--primary)',
                color: 'white',
                boxShadow: '0 8px 30px rgba(13,148,136,0.35)',
                fontSize: 14,
              }}
            >
              Enter Demo <ArrowRight size={15} className="inline ml-1" />
            </Link>
            <button
              onClick={() => setJudgeMode(true)}
              className="btn-press px-6 py-3 rounded-2xl display font-semibold"
              style={{
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
                fontSize: 14,
              }}
            >
              Start Judge Mode
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
            {PILLARS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 + index * 0.06 }}
                className="rounded-2xl p-4 card-lift"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}1E`, border: `1px solid ${item.color}55` }}
                >
                  <item.icon size={18} style={{ color: item.color }} />
                </div>
                <p className="display font-semibold mt-3" style={{ fontSize: 16, color: 'var(--text-primary)' }}>
                  {item.title}
                </p>
                <p className="mono mt-1" style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <p className="mono mb-2" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Core Modules
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MODULES.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.06 }}
                  className="rounded-2xl p-4 card-lift"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}1F`, border: `1px solid ${item.color}55` }}>
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <p className="display font-semibold mt-3" style={{ fontSize: 15, color: 'var(--text-primary)' }}>
                    {item.title}
                  </p>
                  <p className="mono mt-1" style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                  <Link to={item.route} className="mono inline-flex items-center gap-1 mt-2" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    Open <ArrowRight size={11} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-4 left-0 right-0 px-4 z-30 sm:hidden pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <button
            onClick={() => setJudgeMode(true)}
            className="w-full rounded-2xl py-3 display font-semibold btn-press"
            style={{
              background: 'linear-gradient(135deg, var(--primary), #0B7E74)',
              color: 'white',
              boxShadow: '0 10px 36px rgba(13,148,136,0.42)',
              fontSize: 14,
            }}
          >
            Judge Mode: 90s Guided Demo
          </button>
        </div>
      </div>

      <AnimatePresence>
        {judgeMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sheet-backdrop"
            style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 12px' }}
            onClick={() => setJudgeMode(false)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              className="w-full max-w-lg rounded-t-3xl p-5"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                marginBottom: 'env(safe-area-inset-bottom)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="display font-semibold" style={{ fontSize: 17, color: 'var(--text-primary)' }}>
                  BrinHack Judge Mode
                </p>
                <button
                  onClick={() => setJudgeMode(false)}
                  className="btn-press w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                >
                  <X size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <p className="mono mb-3" style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Use this exact flow for maximum clarity in 90 seconds. Each step maps to one or more judging criteria.
              </p>

              <div className="space-y-2">
                {DEMO_STEPS.map((item) => (
                  <Link
                    key={item.step}
                    to={item.route}
                    onClick={() => setJudgeMode(false)}
                    className="block rounded-2xl p-3 btn-press"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mono" style={{ fontSize: 11, color: 'var(--primary-light)', marginTop: 1 }}>
                        {item.step}
                      </span>
                      <div className="flex-1">
                        <p className="display font-semibold" style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                          {item.title}
                        </p>
                        <p className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.55 }}>
                          {item.detail}
                        </p>
                      </div>
                      <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
