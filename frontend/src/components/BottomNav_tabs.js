import { LayoutDashboard, Zap, MapPin, ShieldCheck, UserCircle } from 'lucide-react'

export const MAIN_TABS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/slump-shield', icon: Zap, label: 'Shield' },
  { path: '/city', icon: MapPin, label: 'City' },
  { path: '/passport', icon: ShieldCheck, label: 'Passport' },
  { path: '/profile', icon: UserCircle, label: 'Profile' },
]
