import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Shield, Globe, HelpCircle, ChevronRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const LANGS = ['English', 'Hindi', 'Kannada', 'Tamil']

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className="btn-press relative" style={{ width: 40, height: 22 }}>
      <div className="absolute inset-0 rounded-full" style={{ background: value ? 'var(--primary)' : 'var(--bg-elevated)', border: `1px solid ${value ? 'var(--primary)' : 'var(--border-default)'}` }} />
      <motion.div className="absolute top-0.5 rounded-full" style={{ width: 18, height: 18, background: 'white' }} animate={{ left: value ? 20 : 2 }} transition={{ type: 'spring', stiffness: 480, damping: 36 }} />
    </button>
  )
}

export default function Profile() {
  const [notifications, setNotifications] = useState(true)
  const [biometricLock, setBiometricLock] = useState(true)
  const { language, setLanguage } = useLanguage()

  return (
    <div className="page-pad max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 mt-2">
        <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Account</p>
        <h1 className="display font-bold" style={{ fontSize: 'clamp(24px,6vw,32px)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Profile
        </h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 mb-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <p className="display font-bold" style={{ fontSize: 20, color: 'var(--text-primary)' }}>Ravi Kumar</p>
        <p className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>GS-IND-22091</p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { k: 'Platforms', v: '3' },
            { k: 'Trips', v: '8,382' },
            { k: 'Level', v: 'L2' },
          ].map((item) => (
            <div key={item.k} className="rounded-xl p-2 text-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <p className="display font-bold" style={{ fontSize: 16, color: 'var(--primary-light)' }}>{item.v}</p>
              <p className="mono" style={{ fontSize: 9, color: 'var(--text-muted)' }}>{item.k}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
        className="rounded-2xl mb-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <Bell size={14} style={{ color: 'var(--text-muted)' }} />
          <div className="flex-1">
            <p className="display font-semibold" style={{ fontSize: 13, color: 'var(--text-primary)' }}>Notifications</p>
            <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>Risk alerts and payout events</p>
          </div>
          <Toggle value={notifications} onChange={setNotifications} />
        </div>
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <Shield size={14} style={{ color: 'var(--text-muted)' }} />
          <div className="flex-1">
            <p className="display font-semibold" style={{ fontSize: 13, color: 'var(--text-primary)' }}>Biometric Lock</p>
            <p className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>Protect app access on device</p>
          </div>
          <Toggle value={biometricLock} onChange={setBiometricLock} />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={14} style={{ color: 'var(--text-muted)' }} />
            <p className="mono" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Language</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGS.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className="btn-press rounded-xl p-2 text-left"
                style={{
                  background: language === lang ? 'var(--primary-dim)' : 'var(--bg-elevated)',
                  border: `1px solid ${language === lang ? 'var(--border-brand)' : 'var(--border-subtle)'}`,
                  color: language === lang ? 'var(--primary-light)' : 'var(--text-secondary)',
                }}
              >
                <span className="mono" style={{ fontSize: 11 }}>{lang}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
        className="rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        {[{ t: 'Help Center', i: HelpCircle }, { t: 'Security Notes', i: Shield }].map((row, idx) => (
          <button key={row.t} className="w-full p-4 flex items-center gap-3 btn-press" style={{ borderBottom: idx === 0 ? '1px solid var(--border-subtle)' : '' }}>
            <row.i size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="display font-semibold flex-1 text-left" style={{ fontSize: 13, color: 'var(--text-primary)' }}>{row.t}</span>
            <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
        ))}
      </motion.div>
    </div>
  )
}
