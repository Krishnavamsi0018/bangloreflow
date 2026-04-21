/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { 50:'#F0FDFA',100:'#CCFBF1',200:'#99F6E4',300:'#5EEAD4',400:'#2DD4BF',500:'#14B8A6',600:'#0D9488',700:'#0F766E',800:'#115E59',900:'#134E4A' },
        secondary: { 50:'#FFFBEB',100:'#FEF3C7',200:'#FDE68A',300:'#FCD34D',400:'#FBBF24',500:'#F59E0B',600:'#D97706',700:'#B45309',800:'#92400E',900:'#78350F' },
        surface:   { base:'#07080B',card:'#12141A',elevated:'#161820',overlay:'rgba(7,8,11,0.85)' },
        content:   { primary:'#F1F5F9',secondary:'#94A3B8',muted:'#475569' },
      },
      fontFamily: {
        display: ['Sora','DM Sans','sans-serif'],
        body:    ['DM Sans','Inter','system-ui','sans-serif'],
        mono:    ['JetBrains Mono','Fira Code','monospace'],
      },
      fontSize: {
        '2xs': ['11px',{lineHeight:'1.4',letterSpacing:'-0.01em'}],
        xs:    ['13px',{lineHeight:'1.5'}],
        sm:    ['15px',{lineHeight:'1.6'}],
        base:  ['15px',{lineHeight:'1.6'}],
        md:    ['17px',{lineHeight:'1.5',letterSpacing:'-0.01em'}],
        lg:    ['20px',{lineHeight:'1.4',letterSpacing:'-0.02em'}],
        xl:    ['24px',{lineHeight:'1.3',letterSpacing:'-0.03em'}],
        '2xl': ['28px',{lineHeight:'1.2',letterSpacing:'-0.03em'}],
        '3xl': ['36px',{lineHeight:'1.1',letterSpacing:'-0.04em'}],
        '4xl': ['44px',{lineHeight:'1.0',letterSpacing:'-0.04em'}],
      },
      borderRadius: { sm:'4px',md:'8px',lg:'12px',xl:'16px','2xl':'20px','3xl':'28px',full:'9999px' },
      boxShadow: {
        sm:    '0 1px 3px rgba(15,23,42,0.2)',
        md:    '0 4px 12px rgba(15,23,42,0.3)',
        lg:    '0 10px 30px rgba(15,23,42,0.4)',
        brand: '0 8px 24px rgba(13,148,136,0.28)',
        amber: '0 8px 24px rgba(245,158,11,0.22)',
        inner: 'inset 0 2px 6px rgba(15,23,42,0.3)',
      },
      animation: {
        shimmer:      'shimmer 5s linear infinite',
        'skeleton-wave':'skeleton-wave 1.6s ease-in-out infinite',
        float:        'float 4s ease-in-out infinite',
        'spin-slow':  'spin 20s linear infinite',
        'pulse-soft': 'pulse 3s ease-in-out infinite',
        'rise':       'rise 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'pop':        'pop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      keyframes: {
        rise: { '0%':{opacity:0,transform:'translateY(12px)'},'100%':{opacity:1,transform:'translateY(0)'} },
        pop:  { '0%':{transform:'scale(0.85)',opacity:0},'100%':{transform:'scale(1)',opacity:1} },
      },
    }
  },
  plugins: [],
}
