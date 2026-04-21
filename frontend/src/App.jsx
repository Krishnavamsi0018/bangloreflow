import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import BottomNav from './components/BottomNav'
import AppHeader from './components/AppHeader'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import SlumpShield from './pages/SlumpShield'
import CityDashboard from './pages/CityDashboard'
import GigPassportSimple from './pages/GigPassportSimple'
import Profile from './pages/Profile'

export default function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <div className="grain min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {!isLanding && <AppHeader />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/slump-shield" element={<SlumpShield />} />
        <Route path="/city" element={<CityDashboard />} />
        <Route path="/city-dashboard" element={<CityDashboard />} />
        <Route path="/passport" element={<GigPassportSimple />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Landing />} />
      </Routes>
      {!isLanding && <BottomNav />}
      <Toaster
        position="bottom-center"
        gutter={8}
        containerStyle={{ bottom: 80 }}
        toastOptions={{
          duration: 3200,
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            maxWidth: '92vw',
          },
          success: { iconTheme: { primary: '#14B8A6', secondary: 'var(--bg-base)' } },
          error: { iconTheme: { primary: '#F87171', secondary: 'var(--bg-base)' } },
        }}
      />
    </div>
  )
}
