import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Bell, ChevronLeft } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import { motion } from 'framer-motion'

const TITLES = {
  '/dashboard':    'Dashboard',
  '/passport':     'Gig Passport',
  '/slump-shield': 'Slump Shield',
  '/claims':       'Claims',
  '/benefits':     'Benefits',
  '/nft-badges':   'NFT Badges',
  '/zk-proof':     'ZK Proof',
  '/profile':      'Profile',
}

// Root tabs — no back arrow on these
const ROOT_TABS = ['/dashboard']

export default function AppHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { account, isDemoMode } = useWallet()

  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  const title = TITLES[normalizedPath] || 'GigSecure'
  const isRoot = ROOT_TABS.some(tab => normalizedPath === tab || normalizedPath.startsWith(`${tab}/`))
  const showBack = !isRoot

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-30 glass"
      style={{ height: 'var(--header-h)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="h-full max-w-lg mx-auto px-4" style={{ display: 'flex', alignItems: 'center' }}>

        {/* Left — back button or logo */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <div className="flex items-center gap-2.5">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="btn-press flex items-center gap-1.5 rounded-xl px-2 py-1.5"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <ChevronLeft size={16} style={{ color: 'var(--text-secondary)' }} />
              <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--primary-dim)', border: '1px solid var(--border-brand)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L1.5 3.5V7C1.5 10.08 3.88 12.97 7 13.5C10.12 12.97 12.5 10.08 12.5 7V3.5L7 1Z"
                    fill="var(--primary)" opacity="0.9" />
                </svg>
              </div>
              <span className="display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                GigSecure
              </span>
            </div>
          )}
          </div>
        </div>

        {/* Center — page title */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <motion.p
            key={pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="display font-semibold"
            style={{
              fontSize: 14,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
              pointerEvents: 'none',
            }}
          >
            {title}
          </motion.p>
        </div>

        {/* Right — wallet + notification */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div className="flex items-center gap-2">
            {isDemoMode && (
              <div className="hidden sm:flex items-center gap-1.5 pill pill-warning">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Demo Mode</span>
              </div>
            )}
            {account && (
              <div className="hidden sm:flex items-center gap-1.5 pill pill-brand">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{account.slice(0, 6)}…{account.slice(-4)}</span>
              </div>
            )}
            <Link
              to="/profile"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center btn-press"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <Bell size={15} style={{ color: 'var(--text-secondary)' }} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
                style={{ background: '#FBBF24', borderColor: 'var(--bg-base)' }}
              />
            </Link>
          </div>
        </div>

      </div>
    </motion.header>
  )
}
