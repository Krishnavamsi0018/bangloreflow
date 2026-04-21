import { createContext, useContext, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

const LANGUAGE_STORAGE_KEY = 'bengaluruflow.language'

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return saved || 'English'
  })

  const value = useMemo(() => ({
    language,
    setLanguage: (next) => {
      setLanguage(next)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
    },
  }), [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
