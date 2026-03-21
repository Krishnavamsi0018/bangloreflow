import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Shield, CheckCircle2, Lock, ChevronRight, IndianRupee, Calendar, Users, Heart, Baby, AlertTriangle, ExternalLink, Info, Sparkles } from 'lucide-react'
import api from '../utils/api'

const BENEFITS = [
  {
    id: 'epf',
    name: 'EPF — Provident Fund',
    shortName: 'EPF',
    icon: IndianRupee,
    color: '#14B8A6',
    status: 'eligible',
    desc: 'Employee Provident Fund — your retirement savings. Employer contributes 12% of your basic wages.',
    eligibilityReq: '6 months of verified work',
    yourProgress: '6 months ✓',
    monthlyBenefit: '₹2,160/mo saved',
    totalAccrued: '₹12,960',
    howToClaim: 'Auto-enrolled once you generate your Gig Passport and verify 6 months. Funds accessible at age 58 or after 2 months of unemployment.',
    govScheme: 'EPFO — Employees Provident Fund Organisation',
    learnMore: 'https://epfindia.gov.in',
  },
  {
    id: 'esi',
    name: 'ESI — Health Insurance',
    shortName: 'ESI',
    icon: Heart,
    color: '#F87171',
    status: 'eligible',
    desc: 'Employee State Insurance — full medical coverage for you and your family.',
    eligibilityReq: '₹21,000/mo or less earnings',
    yourProgress: 'Qualifying ✓',
    monthlyBenefit: 'Full medical cover',
    totalAccrued: 'Active since Feb 2026',
    howToClaim: 'Visit any ESI dispensary with your GigSecure ID. Show your ZK proof of eligibility — no income disclosure needed.',
    govScheme: 'ESIC — Employees State Insurance Corporation',
    learnMore: 'https://esic.in',
  },
  {
    id: 'gratuity',
    name: 'Gratuity',
    shortName: 'Gratuity',
    icon: Calendar,
    color: '#FBBF24',
    status: 'in-progress',
    desc: 'Long service benefit — lump sum payment after 5 years of continuous work.',
    eligibilityReq: '5 years continuous work',
    yourProgress: '1.2 years of 5',
    monthlyBenefit: '—',
    totalAccrued: '₹4,320 accruing',
    howToClaim: 'Automatically calculated once you reach 5 years. Disbursed within 30 days of application through GigSecure.',
    govScheme: 'Payment of Gratuity Act 1972',
    learnMore: 'https://labour.gov.in',
    progressPct: 24,
  },
  {
    id: 'maternity',
    name: 'Maternity Benefit',
    shortName: 'Maternity',
    icon: Baby,
    color: '#818CF8',
    status: 'locked',
    desc: '26 weeks of paid maternity leave at full average daily wage.',
    eligibilityReq: '80 working days in last 12 months',
    yourProgress: 'Check eligibility',
    monthlyBenefit: 'Full daily wage × 182 days',
    totalAccrued: '—',
    howToClaim: 'Submit a maternity claim via GigSecure at least 8 weeks before expected delivery. Proof of work history via Gig Passport required.',
    govScheme: 'Maternity Benefit (Amendment) Act 2017',
    learnMore: 'https://labour.gov.in',
  },
  {
    id: 'accident',
    name: 'Accident Insurance',
    shortName: 'Accident',
    icon: AlertTriangle,
    color: '#FB923C',
    status: 'locked',
    desc: 'On-job accident cover — compensation for injury, disability, or death during gig work.',
    eligibilityReq: 'Active Gig Passport + Shield',
    yourProgress: 'Activate Slump Shield first',
    monthlyBenefit: 'Up to ₹5,00,000',
    totalAccrued: '—',
    howToClaim: 'File an accident claim within 48 hours of incident. Upload medical documents. Verified on-chain within 24 hours.',
    govScheme: "Employees' Compensation Act 1923",
    learnMore: 'https://labour.gov.in',
  },
  {
    id: 'unemployment',
    name: 'Unemployment Allowance',
    shortName: 'Unemployment',
    icon: Users,
    color: '#94A3B8',
    status: 'locked',
    desc: 'Monthly allowance during involuntary unemployment after verified work history.',
    eligibilityReq: '2 years verified work',
    yourProgress: '1.2 of 2 years',
    monthlyBenefit: '₹3,000–₹6,000/mo',
    totalAccrued: '—',
    howToClaim: 'Auto-triggered when slump lasts more than 30 days with no income. Verified via Slump Shield AI.',
    govScheme: 'Code on Social Security 2020',
    learnMore: 'https://labour.gov.in',
    progressPct: 60,
  },
]

const STATUS_CONFIG = {
  eligible:    { label: 'Eligible',     chipClass: 'pill-success', dotColor: '#4ADE80' },
  'in-progress':{ label: 'In Progress', chipClass: 'pill-warning', dotColor: '#FBBF24' },
  locked:      { label: 'Locked',       chipClass: 'pill',         dotColor: '#475569' },
}

function EligibilityRing({ pct = 0, color = 'var(--primary-light)', size = 56 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const filled = circ * (pct / 100)
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={4} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${filled} ${circ}` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="mono font-bold" style={{ fontSize: 11, color }}>{pct}%</span>
      </div>
    </div>
  )
}

function BenefitDetailSheet({ benefit, onClose }) {
  const sc = STATUS_CONFIG[benefit.status]
  return (
    <div className="sheet-backdrop" onClick={onClose} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-3xl p-6"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border-strong)' }} />

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${benefit.color}18`, border: `1px solid ${benefit.color}30` }}>
            <benefit.icon size={24} style={{ color: benefit.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="display font-bold" style={{ fontSize: 17, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{benefit.name}</p>
            </div>
            <span className={`pill ${sc.chipClass}`} style={{ fontSize: 10 }}>
              <div className="w-1.5 h-1.5 rounded-full inline-block mr-1" style={{ background: sc.dotColor }} />
              {sc.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <p className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{benefit.desc}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { l: 'Eligibility', v: benefit.eligibilityReq },
            { l: 'Your Status', v: benefit.yourProgress },
            { l: 'Monthly Benefit', v: benefit.monthlyBenefit },
            { l: 'Accrued', v: benefit.totalAccrued },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{s.l}</p>
              <p className="mono font-semibold" style={{ fontSize: 12, color: 'var(--text-primary)' }}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* Progress bar if in-progress */}
        {benefit.progressPct !== undefined && (
          <div className="mb-4 rounded-xl p-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex justify-between mb-2">
              <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Progress toward eligibility</span>
              <span className="mono font-semibold" style={{ fontSize: 11, color: benefit.color }}>{benefit.progressPct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card)' }}>
              <div className="h-full rounded-full" style={{ width: `${benefit.progressPct}%`, background: benefit.color }} />
            </div>
          </div>
        )}

        {/* How to claim */}
        <div className="mb-4 rounded-xl p-4" style={{ background: 'var(--primary-dim)', border: '1px solid var(--border-brand)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Info size={13} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
            <span className="mono font-semibold" style={{ fontSize: 11, color: 'var(--primary-light)' }}>How to claim</span>
          </div>
          <p className="mono" style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{benefit.howToClaim}</p>
        </div>

        {/* Gov scheme */}
        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div>
            <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Government Scheme</p>
            <p className="mono font-semibold" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{benefit.govScheme}</p>
          </div>
          <a href={benefit.learnMore} target="_blank" rel="noreferrer" className="btn-press">
            <ExternalLink size={14} style={{ color: 'var(--primary-light)' }} />
          </a>
        </div>

        {/* CTA */}
        {benefit.status === 'eligible' && (
          <button onClick={() => { toast.success(`${benefit.shortName} claim started!`); onClose() }}
            className="w-full btn-press rounded-xl py-3.5 display font-semibold mt-4"
            style={{ background: 'var(--primary)', color: 'white', fontSize: 14, boxShadow: '0 8px 24px rgba(13,148,136,0.28)' }}>
            Claim {benefit.shortName} Now
          </button>
        )}
        {benefit.status === 'in-progress' && (
          <button onClick={() => { toast.success('Reminder set for when you qualify!'); onClose() }}
            className="w-full btn-press rounded-xl py-3.5 display font-semibold mt-4"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 14, border: '1px solid var(--border-default)' }}>
            Notify Me When Eligible
          </button>
        )}
      </motion.div>
    </div>
  )
}

export default function Benefits() {
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBenefits = async () => {
      setLoading(true)
      try {
        const res = await api.post('/benefits/calculate', {
          workingDays: 22,
          monthsActive: 8,
          avgMonthlyEarning: 18000,
          platforms: 3,
        })
        setResult(res.data)
      } catch (error) {
        toast.error(error?.response?.data?.error || 'Failed to calculate benefits')
      } finally {
        setLoading(false)
      }
    }

    fetchBenefits()
  }, [])

  const findBenefitMatch = (benefitName) => {
    const keywordMap = {
      EPF: ['EPF', 'PROVIDENT'],
      ESI: ['ESI', 'HEALTH'],
      GRATUITY: ['GRATUITY'],
      MATERNITY: ['MATERNITY'],
    }
    const normalized = benefitName.toUpperCase()
    const keywords = normalized.includes('EPF')
      ? keywordMap.EPF
      : normalized.includes('ESI')
        ? keywordMap.ESI
        : normalized.includes('GRATUITY')
          ? keywordMap.GRATUITY
          : normalized.includes('MATERNITY')
            ? keywordMap.MATERNITY
            : []

    if (!keywords.length || !Array.isArray(result?.benefits)) return null

    return result.benefits.find((item) => {
      const haystack = `${item?.name || ''} ${item?.benefit || ''} ${item?.type || ''}`.toUpperCase()
      return keywords.some((k) => haystack.includes(k))
    })
  }

  const displayBenefits = BENEFITS.map((benefit) => {
    const match = findBenefitMatch(benefit.name)
    const status = match ? (match.eligible ? 'eligible' : 'in-progress') : benefit.status
    const apiMonthlyAmount = match?.monthlyAmount
    const monthlyBenefit = apiMonthlyAmount != null
      ? `₹${Number(apiMonthlyAmount).toLocaleString('en-IN')}/mo`
      : benefit.monthlyBenefit

    return {
      ...benefit,
      status,
      apiMonthlyAmount,
      monthlyBenefit,
    }
  })

  const eligible = result?.benefits?.filter(b => b.eligible).length ?? 2
  const inProgress = displayBenefits.filter(b => b.status === 'in-progress').length
  const protectionScore = result?.totalScore ?? 50
  const locked = displayBenefits.length - eligible - inProgress

  return (
    <div className="page-pad max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-5 mt-2">
        <p className="mono mb-1" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Social Security</p>
        <h1 className="display font-bold" style={{ fontSize: 'clamp(24px,6vw,32px)', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
          Your <span style={{ color: 'var(--primary-light)' }}>Benefits</span>
        </h1>
        <p className="mono mt-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>What you're entitled to — and how to claim it</p>
      </motion.div>

      {/* Overview card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-4">
          <div>
            <p className="display font-bold" style={{ fontSize: 32, color: 'var(--primary-light)', letterSpacing: '-0.04em' }}>
              {eligible}<span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/{displayBenefits.length}</span>
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Benefits eligible</p>
            <p className="display font-bold mt-2" style={{ fontSize: 20, color: 'var(--secondary)', letterSpacing: '-0.02em' }}>
              {protectionScore}
            </p>
            <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>Protection score</p>
          </div>
          <div className="flex-1">
            <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'var(--bg-elevated)' }}>
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-light))' }}
                initial={{ width: 0 }}
                animate={{ width: `${protectionScore}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              />
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-2 rounded animate-pulse" style={{ background: 'rgba(148,163,184,0.2)' }} />
                <div className="h-2 rounded animate-pulse" style={{ background: 'rgba(148,163,184,0.2)' }} />
                <div className="h-2 rounded animate-pulse" style={{ background: 'rgba(148,163,184,0.2)' }} />
              </div>
            ) : (
              <div className="flex gap-3">
                <span className="flex items-center gap-1 mono" style={{ fontSize: 10, color: '#4ADE80' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{eligible} eligible
                </span>
                <span className="flex items-center gap-1 mono" style={{ fontSize: 10, color: '#FBBF24' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />{inProgress} in progress
                </span>
                <span className="flex items-center gap-1 mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-muted)' }} />{locked} locked
                </span>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-3 flex items-center gap-1.5 mono" style={{ fontSize: 10, color: '#4ADE80' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Calculated from Code on Social Security 2020
          </div>
        )}

        {/* Privacy line */}
        <div className="mt-4 rounded-xl p-3" style={{ background: 'var(--primary-dim)', border: '1px solid var(--border-brand)' }}>
          <p className="mono" style={{ fontSize: 11, color: 'var(--primary-light)', lineHeight: 1.5 }}>
            🔒 Only your eligibility is shared with government systems — not your income amount.
          </p>
        </div>
      </motion.div>

      {/* Benefits list */}
      <div className="space-y-2">
        {displayBenefits.map((benefit, i) => {
          const sc = STATUS_CONFIG[benefit.status]
          const isEligible = benefit.status === 'eligible'
          const isInProgress = benefit.status === 'in-progress'

          return (
            <motion.button key={benefit.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              onClick={() => setSelected(benefit)}
              className="w-full rounded-2xl p-4 text-left card-lift"
              style={{
                background: isEligible ? `${benefit.color}08` : 'var(--bg-card)',
                border: `1px solid ${isEligible ? benefit.color + '25' : isInProgress ? 'var(--border-amber)' : 'var(--border-subtle)'}`,
              }}
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isEligible ? `${benefit.color}20` : 'var(--bg-elevated)',
                    border: `1px solid ${isEligible ? benefit.color + '30' : 'var(--border-subtle)'}`,
                  }}>
                  {isEligible
                    ? <benefit.icon size={19} style={{ color: benefit.color }} />
                    : <Lock size={16} style={{ color: 'var(--text-muted)' }} />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="display font-semibold" style={{ fontSize: 14, color: isEligible ? 'var(--text-primary)' : 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
                      {benefit.name}
                    </p>
                    {benefit.apiMonthlyAmount != null && (
                      <span className="mono" style={{ fontSize: 10, color: benefit.color }}>
                        ₹{Number(benefit.apiMonthlyAmount).toLocaleString('en-IN')}/mo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`pill ${sc.chipClass}`} style={{ fontSize: 9 }}>
                      <div className="w-1.5 h-1.5 rounded-full inline-block mr-1" style={{ background: sc.dotColor }} />
                      {sc.label}
                    </span>
                    {isEligible && (
                      <span className="mono" style={{ fontSize: 10, color: benefit.color }}>{benefit.monthlyBenefit}</span>
                    )}
                    {isInProgress && benefit.progressPct && (
                      <span className="mono" style={{ fontSize: 10, color: '#FBBF24' }}>{benefit.progressPct}% there</span>
                    )}
                  </div>
                </div>

                {/* Right — ring or arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isInProgress && benefit.progressPct && (
                    <EligibilityRing pct={benefit.progressPct} color={benefit.color} size={44} />
                  )}
                  {isEligible && (
                    <CheckCircle2 size={16} style={{ color: benefit.color }} />
                  )}
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* In-progress bar inline */}
              {isInProgress && benefit.progressPct && (
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="h-full rounded-full" style={{ width: `${benefit.progressPct}%`, background: benefit.color }} />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Code on Social Security note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-4 rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, var(--bg-card), #141410)', border: '1px solid var(--border-amber)' }}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl float flex items-center justify-center flex-shrink-0" style={{ background: 'var(--secondary-dim)', border: '1px solid var(--border-amber)' }}>
            <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
          </div>
          <div>
            <p className="display font-bold" style={{ fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Code on Social Security 2020</p>
            <p className="mono mt-1" style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              India's law mandates these benefits for gig workers. GigSecure gives you the tools to actually claim them.
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selected && <BenefitDetailSheet benefit={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
