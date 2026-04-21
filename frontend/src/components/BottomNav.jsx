import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Zap, MapPin, ShieldCheck, UserCircle, MoreHorizontal, Home, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedContent from './AnimatedContent'

const MAIN_TABS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/slump-shield', icon: Zap, label: 'Shield' },
  { path: '/city', icon: MapPin, label: 'City' },
  { path: '/passport', icon: ShieldCheck, label: 'Passport' },
  { path: '/profile', icon: UserCircle, label: 'Profile' },
]

const MORE_ITEMS = [
  { path: '/', icon: Home, label: 'Landing', sub: 'Pitch view for judges', color: '#14B8A6' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Worker Dashboard', sub: 'Personal snapshot', color: '#F59E0B' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)
  const isMoreActive = MORE_ITEMS.some(m => m.path === pathname)

  useEffect(() => {
    if (!showMore) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [showMore])

  const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.24, ease: 'easeOut' } },
  }

  return (
    <>
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="sheet-backdrop"
            onClick={() => setShowMore(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 45, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 12px' }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 38 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-t-3xl p-5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', marginBottom: 'calc(var(--nav-h) + env(safe-area-inset-bottom) + 8px)', paddingBottom: '20px' }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border-strong)' }} />
              <div className="flex items-center justify-between mb-4">
                <p className="mono font-semibold" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Quick shortcuts</p>
                <button onClick={() => setShowMore(false)} className="btn-press w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <X size={13} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
              <motion.div className="space-y-2" variants={listVariants} initial="hidden" animate="show">
                {MORE_ITEMS.map((item, i) => (
                  <AnimatedContent key={item.path} distance={40} direction="vertical" reverse={false} duration={0.5} ease="power3.out" initialOpacity={0} animateOpacity scale={0.97} threshold={0} delay={0}>
                    <motion.button
                      variants={itemVariants}
                      onClick={() => { navigate(item.path); setShowMore(false) }}
                      className="w-full btn-press rounded-2xl p-4 text-left flex items-center gap-3"
                      style={{ background: pathname === item.path ? `${item.color}12` : 'var(--bg-card)', border: `1px solid ${pathname === item.path ? item.color + '30' : 'var(--border-subtle)'}` }}
                    >
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}18`, border: `1px solid ${item.color}28` }}>
                        <item.icon size={20} style={{ color: item.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="display font-semibold" style={{ fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{item.label}</p>
                        <p className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.sub}</p>
                      </div>
                      {pathname === item.path && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />}
                    </motion.button>
                  </AnimatedContent>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-30 glass safe-nav" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="h-16 max-w-lg mx-auto flex items-center justify-around px-2">
          {MAIN_TABS.map(({ path, icon: Icon, label }) => {
            const active = pathname === path
            return (
              <NavLink key={path} to={path} className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl btn-press" style={{ minWidth: 52, minHeight: 48 }}>
                {active && <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-xl" style={{ background: 'var(--primary-dim)', border: '1px solid var(--border-brand)' }} transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                <Icon size={20} strokeWidth={active ? 2.2 : 1.6} style={{ color: active ? 'var(--primary-light)' : 'var(--text-muted)', position: 'relative' }} />
                <span className="mono relative" style={{ fontSize: 9, fontWeight: active ? 600 : 400, color: active ? 'var(--primary-light)' : 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
              </NavLink>
            )
          })}
          <button onClick={() => setShowMore(m => !m)} className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl btn-press" style={{ minWidth: 52, minHeight: 48 }}>
            {(showMore || isMoreActive) && <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-xl" style={{ background: 'var(--primary-dim)', border: '1px solid var(--border-brand)' }} transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
            <MoreHorizontal size={20} strokeWidth={showMore || isMoreActive ? 2.2 : 1.6} style={{ color: showMore || isMoreActive ? 'var(--primary-light)' : 'var(--text-muted)', position: 'relative' }} />
            <span className="mono relative" style={{ fontSize: 9, fontWeight: showMore || isMoreActive ? 600 : 400, color: showMore || isMoreActive ? 'var(--primary-light)' : 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>More</span>
          </button>
        </div>
      </nav>
    </>
  )
}
