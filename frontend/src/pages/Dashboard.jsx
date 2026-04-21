import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, ShieldCheck, Zap, UserCircle, ArrowRight, AlertTriangle } from 'lucide-react'

const QUICK = [
  { label: 'Gig Passport', sub: 'Worker identity and badges', icon: ShieldCheck, path: '/passport', color: '#60A5FA' },
  { label: 'SlumpShield', sub: 'Risk gauge and live controls', icon: Zap, path: '/slump-shield', color: '#F59E0B' },
  { label: 'City Dashboard', sub: 'Real-time city operations view', icon: BarChart3, path: '/city', color: '#14B8A6' },
  { label: 'Profile', sub: 'Preferences and support settings', icon: UserCircle, path: '/profile', color: '#A78BFA' },
]

export default function Dashboard() {
  return (
    <div className="page-pad max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 mt-2">
        <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Home</p>
        <h1 className="display font-bold" style={{ fontSize: 'clamp(24px,6vw,32px)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Dashboard
        </h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="rounded-2xl p-4 mb-3" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
        <div className="flex items-center gap-2.5">
          <AlertTriangle size={16} style={{ color: '#F87171' }} />
          <div>
            <p className="mono" style={{ fontSize: 12, color: '#F87171' }}>Income volatility detected this week</p>
            <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>Open SlumpShield for adjusted risk simulation and projected cover.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUICK.map((q, i) => (
          <motion.div key={q.path} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            <Link to={q.path} className="block rounded-2xl p-4 card-lift" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${q.color}22`, border: `1px solid ${q.color}55` }}>
                <q.icon size={18} style={{ color: q.color }} />
              </div>
              <p className="display font-semibold mt-3" style={{ fontSize: 16, color: 'var(--text-primary)' }}>{q.label}</p>
              <p className="mono mt-1" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{q.sub}</p>
              <p className="mono mt-2 inline-flex items-center gap-1" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                Open <ArrowRight size={12} />
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
