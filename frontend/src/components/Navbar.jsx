import { Link, useLocation } from 'react-router-dom'
import { Shield, Sparkles, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/city-dashboard', label: 'City Dashboard' },
  { path: '/passport', label: 'Gig Passport' },
  { path: '/slump-shield', label: 'Slump Shield' },
  { path: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#08080A]/90 backdrop-blur-2xl border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
            <Shield className="w-4 h-4 text-zinc-950" />
          </div>
          <span className="font-display font-700 text-[15px] text-white tracking-tight" style={{ fontFamily: 'Bricolage Grotesque' }}>
            GigSecure<span className="text-zinc-500 font-400">Chain</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="relative px-3.5 py-1.5 text-sm rounded-lg group">
              <span className={`relative z-10 transition-colors ${location.pathname === link.path ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-200'}`}>
                {link.label}
              </span>
              {location.pathname === link.path && (
                <motion.div layoutId="nav-pill"
                  className="absolute inset-0 bg-zinc-800 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Wallet + hamburger */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-lg border border-white/10 text-zinc-300 bg-zinc-900/60">
            <Sparkles className="w-3.5 h-3.5" />
            Demo Mode
          </span>
          <button className="md:hidden p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-all" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden border-t border-white/[0.06] bg-[#08080A]/95 backdrop-blur-2xl px-5 py-3 flex flex-col gap-1"
          >
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`px-3 py-2.5 rounded-lg text-sm transition-all ${location.pathname === link.path ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/60'}`}
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
