import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'

const WalletContext = createContext(null)
const DEMO_ACCOUNT = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'

const DEMO_PROFILE = {
  workerName: 'Ravi Kumar',
  workerId: 'GS-IND-22091',
  phone: '+91 98765 43210',
  platforms: ['Swiggy', 'Uber', 'Zomato'],
  workingDays: 42,
  totalEarnings: 30213,
  avgMonthlyEarning: 18000,
  passportId: 'PASS-2026-RAVI-22091',
  txHash: '0x3f7a2b9c4e1d8f2235bc8021f3aa12bb8435ac9e245e5d510b2e5b58cb9a13fe',
}

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const tryDemoMode = () => {
    setAccount(DEMO_ACCOUNT)
    setIsDemoMode(true)
    toast.success('Demo mode active. Mock worker profile loaded.')
  }

  const connectWallet = async () => {
    if (isDemoMode) {
      setIsDemoMode(false)
    }
    if (account && !isDemoMode) return
    setIsConnecting(true)
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
        setIsDemoMode(false)
        toast.success('Wallet connected!')
      } else {
        toast.error('MetaMask not found. Use Try Demo.')
      }
    } catch (e) {
      toast.error('Wallet connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setIsDemoMode(false)
    toast.success('Disconnected')
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        connectWallet,
        disconnect,
        isConnecting,
        isDemoMode,
        tryDemoMode,
        demoProfile: DEMO_PROFILE,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be inside WalletProvider')
  return ctx
}
