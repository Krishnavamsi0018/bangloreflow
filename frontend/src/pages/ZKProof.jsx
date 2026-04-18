import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Lock, CheckCircle2, Copy, ExternalLink, Shield, Eye, EyeOff, RefreshCw, Info, ChevronDown } from 'lucide-react'

const THRESHOLDS = [
  { label: 'Minimum wage — ₹500/day', value: '500', desc: 'Prove you earn above minimum wage' },
  { label: 'EPF eligible — 6 months', value: 'epf', desc: 'Prove EPF eligibility' },
  { label: 'ESI eligible — ₹21,000/mo', value: 'esi', desc: 'Prove ESI eligibility' },
  { label: 'Slump threshold — ₹300/day', value: '300', desc: 'Prove income is below slump threshold' },
  { label: 'Custom threshold', value: 'custom', desc: 'Set your own earnings threshold' },
]

const PROOF_STEPS = [
  { label: 'Loading earnings records',      detail: 'Fetching from Gig Passport…' },
  { label: 'Hashing private inputs',        detail: 'SHA-256 hash of raw earnings' },
  { label: 'Building arithmetic circuit',   detail: 'Groth16 constraint system' },
  { label: 'Generating ZK witness',         detail: 'Computing satisfying assignment' },
  { label: 'Creating Groth16 proof',        detail: 'Proving time ~1.2s' },
  { label: 'Verifying proof locally',       detail: 'Checking proof validity' },
  { label: 'Anchoring on Polygon Amoy',   detail: 'Writing to chain…' },
  { label: 'Proof ready',                   detail: '✓ Verification complete' },
]

const MOCK_SIGNALS = [
  { label: 'Worker Address',    value: '0x742d…C9D8',  public: true  },
  { label: 'Threshold Met',     value: 'true',          public: true  },
  { label: 'Passport ID',       value: 'GS-IND-22091',  public: true  },
  { label: 'Earnings Amount',   value: '— HIDDEN —',    public: false },
  { label: 'Platform Details',  value: '— HIDDEN —',    public: false },
  { label: 'Daily Breakdown',   value: '— HIDDEN —',    public: false },
]

const PAST_PROOFS = [
  { id: 'zkp-001', threshold: 'EPF eligible', date: 'Mar 15, 2026', tx: '0x3f7a…4e1d', valid: true  },
  { id: 'zkp-002', threshold: 'ESI eligible', date: 'Mar 10, 2026', tx: '0x8c21…9b3a', valid: true  },
  { id: 'zkp-003', threshold: '₹500/day min', date: 'Feb 28, 2026', tx: '0x1d45…7f22', valid: false },
]

function CircuitAnimation({ step }) {
  const nodes = [
    { x: 20, y: 50, label: 'Input' },
    { x: 35, y: 25, label: 'H(w)' },
    { x: 35, y: 75, label: 'H(k)' },
    { x: 50, y: 50, label: 'Circuit' },
    { x: 65, y: 30, label: 'π' },
    { x: 65, y: 70, label: 'vk' },
    { x: 80, y: 50, label: 'Verify' },
  ]
  const edges = [
    [0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6]
  ]
  return (
    <svg viewBox="0 0 100 100" width="100%" height="120" style={{ overflow: 'visible' }}>
      {edges.map(([a, b], i) => (
        <motion.line key={i}
          x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
          x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
          stroke={i < step ? 'var(--primary)' : 'var(--border-subtle)'}
          strokeWidth={0.8}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.15 }}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle cx={`${n.x}%`} cy={`${n.y}%`} r={3.5}
            fill={i < step + 1 ? 'var(--primary)' : 'var(--bg-elevated)'}
            stroke={i < step + 1 ? 'var(--primary-light)' : 'var(--border-default)'}
            strokeWidth={0.8}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: i * 0.1 }}
          />
          <text x={`${n.x}%`} y={`${n.y + 8}%`} textAnchor="middle"
            fill={i < step + 1 ? '#14B8A6' : '#475569'}
            style={{ fontSize: 4, fontFamily: 'JetBrains Mono' }}>
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function ZKProof() {
  const [threshold, setThreshold] = useState(THRESHOLDS[0])
  const [customAmount, setCustomAmount] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [genState, setGenState] = useState('idle') // idle | generating | done
  const [completedSteps, setCompletedSteps] = useState([])
  const [proofData, setProofData] = useState(null)
  const [showSignals, setShowSignals] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setGenState('generating')
    setCompletedSteps([])
    setProofData(null)

    for (let i = 0; i < PROOF_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 480 + Math.random() * 220))
      setCompletedSteps(s => [...s, i])
    }

    const mockProof = {
      id: `zkp-${Date.now().toString(36)}`,
      tx: `0x${Math.random().toString(16).slice(2, 10)}…${Math.random().toString(16).slice(2, 8)}`,
      fullTx: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockNumber: 47382910 + Math.floor(Math.random() * 100),
      validUntil: '24 hours',
      threshold: threshold.label,
    }
    setProofData(mockProof)
    setGenState('done')
    toast.success('Proof anchored on Polygon Amoy')
  }

  const reset = () => {
    setGenState('idle')
    setCompletedSteps([])
    setProofData(null)
  }

  const copyHash = () => {
    navigator.clipboard.writeText(proofData?.fullTx || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Hash copied!')
  }

  return (
    <div className="page-pad max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-5 mt-2">
        <p className="mono mb-1" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Zero-Knowledge Proofs</p>
        <h1 className="display font-bold" style={{ fontSize: 'clamp(24px,6vw,32px)', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
          Prove It. <span style={{ color: 'var(--primary-light)' }}>Without Revealing It.</span>
        </h1>
        <p className="mono mt-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>Your income stays private. Only eligibility is shared.</p>
      </motion.div>

      {/* Explainer */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-brand)' }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-dim)', border: '1px solid var(--border-brand)' }}>
            <Info size={14} style={{ color: 'var(--primary-light)' }} />
          </div>
          <div>
            <p className="display font-semibold mb-1" style={{ fontSize: 13, color: 'var(--text-primary)' }}>What is a ZK Proof?</p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              A mathematical proof that confirms you meet a condition — without revealing any underlying data.
              Government systems see <span style={{ color: '#4ADE80' }}>"Eligible: Yes"</span>. Your income, platforms, and daily breakdown are <span style={{ color: '#F87171' }}>never exposed</span>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Threshold selector */}
      {genState === 'idle' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
          <p className="mono mb-2" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Select what you want to prove</p>
          <div className="relative">
            <button onClick={() => setShowDropdown(d => !d)}
              className="w-full btn-press rounded-xl p-4 text-left flex items-center justify-between"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-brand)' }}>
              <div>
                <p className="display font-semibold" style={{ fontSize: 14, color: 'var(--text-primary)' }}>{threshold.label}</p>
                <p className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{threshold.desc}</p>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: showDropdown ? 'rotate(180deg)' : '', transition: 'transform 0.2s', flexShrink: 0 }} />
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute left-0 right-0 mt-1 rounded-xl overflow-hidden z-20"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                  {THRESHOLDS.map((t, i) => (
                    <button key={i} onClick={() => { setThreshold(t); setShowDropdown(false) }}
                      className="w-full btn-press p-3.5 text-left flex items-center justify-between"
                      style={{ borderBottom: i < THRESHOLDS.length - 1 ? '1px solid var(--border-subtle)' : '', background: threshold.value === t.value ? 'var(--primary-dim)' : 'transparent' }}>
                      <div>
                        <p className="display font-semibold" style={{ fontSize: 13, color: threshold.value === t.value ? 'var(--primary-light)' : 'var(--text-primary)' }}>{t.label}</p>
                        <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{t.desc}</p>
                      </div>
                      {threshold.value === t.value && <CheckCircle2 size={13} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {threshold.value === 'custom' && (
            <div className="mt-2">
              <input type="number" className="input-field" placeholder="Enter threshold amount in ₹/day"
                value={customAmount} onChange={e => setCustomAmount(e.target.value)} />
            </div>
          )}
        </motion.div>
      )}

      {/* Circuit animation + proof generation */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-5 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>

        {/* Circuit diagram */}
        <div className="mb-4">
          <p className="mono mb-2" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Groth16 circuit · Polygon Amoy</p>
          <div className="rounded-xl p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <CircuitAnimation step={completedSteps.length} />
          </div>
        </div>

        {/* Steps */}
        {genState !== 'idle' && (
          <div className="space-y-2 mb-4">
            {PROOF_STEPS.map((step, i) => {
              const done = completedSteps.includes(i)
              const active = genState === 'generating' && completedSteps.length === i
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: done || active ? 1 : 0.3, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: done ? 'var(--primary)' : active ? 'var(--bg-elevated)' : 'transparent', border: done ? 'none' : `1px solid ${active ? 'var(--primary-light)' : 'var(--border-subtle)'}` }}>
                    {done
                      ? <CheckCircle2 size={10} style={{ color: 'white' }} />
                      : active
                        ? <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary-light)' }}
                            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                        : null
                    }
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: 11, color: done ? 'var(--text-secondary)' : active ? 'var(--primary-light)' : 'var(--text-muted)' }}>
                      {step.label}
                    </span>
                    {active && (
                      <span className="mono ml-2" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{step.detail}</span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* CTA */}
        {genState === 'idle' && (
          <button onClick={generate}
            className="w-full btn-press rounded-xl py-3.5 display font-bold flex items-center justify-center gap-2"
            style={{ background: 'var(--primary)', color: 'white', fontSize: 15, boxShadow: '0 8px 24px rgba(13,148,136,0.28)' }}>
            <Lock size={16} />
            Generate ZK Proof
          </button>
        )}

        {genState === 'generating' && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
            <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Generating proof…</span>
          </div>
        )}

        {/* Proof result */}
        {genState === 'done' && proofData && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-xl p-4 mb-3" style={{ background: 'var(--success-bg)', border: '1px solid rgba(74,222,128,0.25)' }}>
              <p className="mono font-semibold mb-1" style={{ fontSize: 12, color: '#4ADE80' }}>✓ Proof anchored on Polygon Amoy</p>
              <p className="mono" style={{ fontSize: 10, color: 'rgba(74,222,128,0.7)' }}>Block #{proofData.blockNumber} · Valid for {proofData.validUntil}</p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl mb-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <span className="mono break-word flex-1" style={{ fontSize: 10, color: 'var(--text-muted)' }}>TX: {proofData.tx}</span>
              <button onClick={copyHash} className="btn-press">
                {copied ? <CheckCircle2 size={13} style={{ color: 'var(--primary-light)' }} /> : <Copy size={13} style={{ color: 'var(--text-muted)' }} />}
              </button>
              <a href="#" className="btn-press"><ExternalLink size={13} style={{ color: 'var(--primary-light)' }} /></a>
            </div>
            <div className="flex gap-2">
              <button onClick={reset} className="flex-1 btn-press rounded-xl py-2.5 flex items-center justify-center gap-1.5 mono"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 12, border: '1px solid var(--border-default)' }}>
                <RefreshCw size={12} /> New Proof
              </button>
              <button onClick={() => { toast.success('Proof shared!') }} className="flex-1 btn-press rounded-xl py-2.5 display font-semibold"
                style={{ background: 'var(--primary)', color: 'white', fontSize: 13 }}>
                Share Proof
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Public signals */}
      {genState === 'done' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <button onClick={() => setShowSignals(s => !s)}
            className="w-full flex items-center justify-between p-4 rounded-xl btn-press mb-1"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <span className="mono font-semibold" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Public signals (what gets shared)</span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: showSignals ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
          </button>
          <AnimatePresence>
            {showSignals && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                  {MOCK_SIGNALS.map((sig, i) => (
                    <div key={i} className="flex items-center justify-between p-3"
                      style={{ borderBottom: i < MOCK_SIGNALS.length - 1 ? '1px solid var(--border-subtle)' : '', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-elevated)' }}>
                      <div className="flex items-center gap-2">
                        {sig.public
                          ? <Eye size={11} style={{ color: '#4ADE80', flexShrink: 0 }} />
                          : <EyeOff size={11} style={{ color: '#F87171', flexShrink: 0 }} />
                        }
                        <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sig.label}</span>
                      </div>
                      <span className="mono font-semibold" style={{ fontSize: 11, color: sig.public ? 'var(--text-secondary)' : '#F87171' }}>
                        {sig.value}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mono mt-2 text-center" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  🔒 Red rows are cryptographically hidden — even Polygon validators cannot read them
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Past proofs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <button onClick={() => setShowHistory(h => !h)}
          className="w-full flex items-center justify-between p-4 rounded-xl btn-press"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <span className="mono font-semibold" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Past proofs ({PAST_PROOFS.length})</span>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: showHistory ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
        </button>
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-2 mt-2">
              {PAST_PROOFS.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: p.valid ? 'var(--success-bg)' : 'rgba(220,38,38,0.1)', border: `1px solid ${p.valid ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
                    <Shield size={14} style={{ color: p.valid ? '#4ADE80' : '#F87171' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="mono font-semibold" style={{ fontSize: 12, color: 'var(--text-primary)' }}>{p.threshold}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.date}</span>
                      <span className="mono break-word" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.tx}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`pill ${p.valid ? 'pill-success' : 'pill-red'}`} style={{ fontSize: 9 }}>
                      {p.valid ? 'Valid' : 'Expired'}
                    </span>
                    <a href="#" className="btn-press"><ExternalLink size={11} style={{ color: 'var(--primary-light)' }} /></a>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
