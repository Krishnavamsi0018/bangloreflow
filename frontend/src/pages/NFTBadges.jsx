import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Award, Lock, Star, Zap, Shield, TrendingUp, CheckCircle2, ExternalLink, Copy, Sparkles, Calendar, IndianRupee } from 'lucide-react'

const BADGES = [
  {
    id: 1,
    name: 'Gig Pioneer',
    desc: 'First worker to mint a Gig Passport on Polygon Amoy',
    icon: Shield,
    color: '#14B8A6',
    bgColor: 'rgba(13,148,136,0.12)',
    borderColor: 'rgba(13,148,136,0.3)',
    earned: true,
    earnedDate: 'Mar 1, 2026',
    tokenId: '#001',
    tx: '0x3f7a2b9c4e1d8f22',
    rarity: 'Legendary',
    rarityColor: '#F59E0B',
    xp: 500,
  },
  {
    id: 2,
    name: 'Slump Survivor',
    desc: 'Survived an income slump and claimed your first payout',
    icon: Zap,
    color: '#FBBF24',
    bgColor: 'rgba(251,191,36,0.12)',
    borderColor: 'rgba(251,191,36,0.3)',
    earned: true,
    earnedDate: 'Mar 10, 2026',
    tokenId: '#028',
    tx: '0x8c21b4d9a7f3e6c1',
    rarity: 'Rare',
    rarityColor: '#818CF8',
    xp: 300,
  },
  {
    id: 3,
    name: 'EPF Achiever',
    desc: 'Reached 6 months of verified work — EPF eligible',
    icon: TrendingUp,
    color: '#4ADE80',
    bgColor: 'rgba(74,222,128,0.12)',
    borderColor: 'rgba(74,222,128,0.3)',
    earned: true,
    earnedDate: 'Feb 28, 2026',
    tokenId: '#012',
    tx: '0x1d45f7a2b8c39e4d',
    rarity: 'Uncommon',
    rarityColor: '#4ADE80',
    xp: 200,
  },
  {
    id: 4,
    name: 'Multi-Platform Pro',
    desc: 'Connected 3+ platforms to your Gig Passport',
    icon: Star,
    color: '#818CF8',
    bgColor: 'rgba(129,140,248,0.12)',
    borderColor: 'rgba(129,140,248,0.3)',
    earned: true,
    earnedDate: 'Feb 15, 2026',
    tokenId: '#007',
    tx: '0x5e9c1a4b7f2d8e30',
    rarity: 'Common',
    rarityColor: '#94A3B8',
    xp: 100,
  },
  {
    id: 5,
    name: 'Consistency King',
    desc: 'Worked 25+ days in a single month',
    icon: Calendar,
    color: '#F87171',
    bgColor: 'rgba(248,113,113,0.12)',
    borderColor: 'rgba(248,113,113,0.3)',
    earned: false,
    requirement: 'Work 25+ days in one month',
    progress: 22,
    target: 25,
    rarity: 'Rare',
    rarityColor: '#818CF8',
    xp: 300,
  },
  {
    id: 6,
    name: 'Claims Champion',
    desc: 'Successfully filed and received 5 benefit claims',
    icon: IndianRupee,
    color: '#34D399',
    bgColor: 'rgba(52,211,153,0.12)',
    borderColor: 'rgba(52,211,153,0.3)',
    earned: false,
    requirement: 'File and receive 5 claims',
    progress: 3,
    target: 5,
    rarity: 'Uncommon',
    rarityColor: '#4ADE80',
    xp: 200,
  },
  {
    id: 7,
    name: 'ZK Guardian',
    desc: 'Generated 10 zero-knowledge proofs',
    icon: Lock,
    color: '#60A5FA',
    bgColor: 'rgba(96,165,250,0.12)',
    borderColor: 'rgba(96,165,250,0.3)',
    earned: false,
    requirement: 'Generate 10 ZK proofs',
    progress: 4,
    target: 10,
    rarity: 'Epic',
    rarityColor: '#F59E0B',
    xp: 400,
  },
  {
    id: 8,
    name: 'ESI Secured',
    desc: 'Activated ESI health insurance coverage',
    icon: Award,
    color: '#FB923C',
    bgColor: 'rgba(251,146,60,0.12)',
    borderColor: 'rgba(251,146,60,0.3)',
    earned: false,
    requirement: 'Activate ESI coverage',
    progress: 0,
    target: 1,
    rarity: 'Common',
    rarityColor: '#94A3B8',
    xp: 150,
  },
]

const TOTAL_XP = BADGES.filter(b => b.earned).reduce((s, b) => s + b.xp, 0)
const EARNED_COUNT = BADGES.filter(b => b.earned).length

function BadgeCard({ badge, onSelect }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(badge)}
      className="relative rounded-2xl p-4 text-left w-full card-lift"
      style={{
        background: badge.earned ? badge.bgColor : 'var(--bg-card)',
        border: `1px solid ${badge.earned ? badge.borderColor : 'var(--border-subtle)'}`,
        opacity: badge.earned ? 1 : 0.75,
      }}
    >
      {/* Rarity tag */}
      <div className="absolute top-3 right-3">
        <span className="mono" style={{ fontSize: 9, color: badge.rarityColor, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {badge.rarity}
        </span>
      </div>

      {/* Icon */}
      <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
        style={{ background: badge.earned ? `${badge.color}20` : 'var(--bg-elevated)', border: `1px solid ${badge.earned ? badge.color + '30' : 'var(--border-subtle)'}` }}>
        {badge.earned ? (
          <badge.icon size={22} style={{ color: badge.color }} />
        ) : (
          <Lock size={18} style={{ color: 'var(--text-muted)' }} />
        )}
        {badge.earned && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: 'var(--success)', border: '1.5px solid var(--bg-base)' }}>
            <CheckCircle2 size={9} style={{ color: 'white' }} />
          </div>
        )}
      </div>

      {/* Name */}
      <p className="display font-bold mb-1" style={{ fontSize: 13, color: badge.earned ? 'var(--text-primary)' : 'var(--text-muted)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
        {badge.name}
      </p>

      {/* XP */}
      <div className="flex items-center gap-1 mb-2">
        <Sparkles size={9} style={{ color: badge.earned ? badge.color : 'var(--text-muted)' }} />
        <span className="mono" style={{ fontSize: 10, color: badge.earned ? badge.color : 'var(--text-muted)' }}>
          {badge.xp} XP
        </span>
      </div>

      {/* Progress bar for unearned */}
      {!badge.earned && badge.progress !== undefined && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-muted)' }}>{badge.progress}/{badge.target}</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--text-muted)' }}>{Math.round((badge.progress / badge.target) * 100)}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: badge.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(badge.progress / badge.target) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </div>
        </div>
      )}

      {badge.earned && (
        <p className="mono" style={{ fontSize: 9, color: 'var(--text-muted)' }}>{badge.earnedDate}</p>
      )}
    </motion.button>
  )
}

function BadgeDetailSheet({ badge, onClose }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(badge.tx || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="sheet-backdrop" onClick={onClose} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-3xl p-6"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', maxHeight: '85vh', overflowY: 'auto' }}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--border-strong)' }} />

        {/* Badge hero */}
        <div className="flex flex-col items-center text-center mb-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4 float"
            style={{ background: badge.bgColor, border: `2px solid ${badge.borderColor}`, boxShadow: `0 12px 40px ${badge.color}30` }}
          >
            {badge.earned
              ? <badge.icon size={40} style={{ color: badge.color }} />
              : <Lock size={32} style={{ color: 'var(--text-muted)' }} />
            }
          </motion.div>
          <p className="display font-bold mb-1" style={{ fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>{badge.name}</p>
          <span className="mono mb-2" style={{ fontSize: 11, color: badge.rarityColor }}>{badge.rarity} · {badge.xp} XP</span>
          <p className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 280 }}>{badge.desc}</p>
        </div>

        {badge.earned ? (
          <div className="space-y-3">
            <div className="rounded-2xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              {[
                { l: 'Token ID', v: badge.tokenId },
                { l: 'Earned On', v: badge.earnedDate },
                { l: 'Network', v: 'Polygon Amoy' },
                { l: 'Standard', v: 'ERC-1155' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 3 ? '1px solid var(--border-subtle)' : '' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.l}</span>
                  <span className="mono font-semibold" style={{ fontSize: 12, color: 'var(--text-primary)' }}>{r.v}</span>
                </div>
              ))}
            </div>

            {/* TX hash */}
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <span className="mono break-word flex-1" style={{ fontSize: 10, color: 'var(--text-muted)' }}>TX: {badge.tx}</span>
              <button onClick={copy} className="btn-press">
                {copied ? <CheckCircle2 size={13} style={{ color: 'var(--primary-light)' }} /> : <Copy size={13} style={{ color: 'var(--text-muted)' }} />}
              </button>
              <a href="#" className="btn-press"><ExternalLink size={13} style={{ color: 'var(--primary-light)' }} /></a>
            </div>

            <div className="rounded-xl p-3" style={{ background: 'var(--primary-dim)', border: '1px solid var(--border-brand)' }}>
              <p className="mono" style={{ fontSize: 11, color: 'var(--primary-light)', lineHeight: 1.5 }}>
                🔒 This badge is permanently recorded on Polygon Amoy. It cannot be altered or removed.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <p className="mono font-semibold mb-2" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>How to earn this badge</p>
            <p className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{badge.requirement}</p>
            {badge.progress !== undefined && (
              <div className="mt-3">
                <div className="flex justify-between mb-1.5">
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progress</span>
                  <span className="mono font-semibold" style={{ fontSize: 11, color: badge.color }}>{badge.progress} / {badge.target}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(badge.progress / badge.target) * 100}%`, background: badge.color }} />
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function NFTBadges() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all') // all | earned | locked

  const filtered = BADGES.filter(b => {
    if (filter === 'earned') return b.earned
    if (filter === 'locked') return !b.earned
    return true
  })

  return (
    <div className="page-pad max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-5 mt-2">
        <p className="mono mb-1" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>On-Chain Achievements</p>
        <h1 className="display font-bold" style={{ fontSize: 'clamp(24px,6vw,32px)', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
          NFT <span style={{ color: 'var(--secondary)' }}>Badges</span>
        </h1>
        <p className="mono mt-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>Soulbound tokens — earned, never bought</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { l: 'Earned', v: `${EARNED_COUNT}/${BADGES.length}`, icon: Award, color: 'var(--secondary)' },
          { l: 'Total XP', v: TOTAL_XP, icon: Sparkles, color: 'var(--primary-light)' },
          { l: 'Rank', v: 'Silver', icon: Star, color: '#818CF8' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <s.icon size={15} className="mx-auto mb-1.5" style={{ color: s.color }} />
            <p className="display font-bold" style={{ fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{s.v}</p>
            <p className="mono" style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{s.l}</p>
          </motion.div>
        ))}
      </div>

      {/* XP progress bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-amber)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={13} style={{ color: 'var(--secondary)' }} />
            <span className="mono font-semibold" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Silver → Gold</span>
          </div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--secondary)' }}>{TOTAL_XP} / 1500 XP</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, var(--secondary), #FBBF24)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(TOTAL_XP / 1500) * 100}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          />
        </div>
        <p className="mono mt-2" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {1500 - TOTAL_XP} XP to reach Gold rank
        </p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[{ k: 'all', l: `All (${BADGES.length})` }, { k: 'earned', l: `Earned (${EARNED_COUNT})` }, { k: 'locked', l: `Locked (${BADGES.length - EARNED_COUNT})` }].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)} className="btn-press rounded-xl px-3 py-1.5 mono transition-all"
            style={{
              fontSize: 11,
              background: filter === f.k ? 'var(--primary-dim)' : 'var(--bg-card)',
              border: `1px solid ${filter === f.k ? 'var(--border-brand)' : 'var(--border-subtle)'}`,
              color: filter === f.k ? 'var(--primary-light)' : 'var(--text-muted)',
            }}>
            {f.l}
          </button>
        ))}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {filtered.map((badge, i) => (
          <motion.div key={badge.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <BadgeCard badge={badge} onSelect={setSelected} />
          </motion.div>
        ))}
      </div>

      {/* Info footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-4 mb-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-start gap-3">
          <Lock size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }} />
          <p className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Badges are <span style={{ color: 'var(--text-secondary)' }}>soulbound ERC-1155 tokens</span> — permanently tied to your wallet. They prove your work history to employers, insurers, and government systems without revealing your income.
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {selected && <BadgeDetailSheet badge={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
