import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { UserCircle, Globe, Bell, Lock, HelpCircle, Shield, ChevronRight, CheckCircle2, Star, Smartphone, LogOut } from 'lucide-react'
import { useWallet } from '../context/WalletContext'

const LANGS = [
  {code:'en',label:'English',native:'English'},
  {code:'hi',label:'Hindi',native:'हिन्दी'},
  {code:'kn',label:'Kannada',native:'ಕನ್ನಡ'},
  {code:'ta',label:'Tamil',native:'தமிழ்'},
]

function ProgressRing({pct=72,size=100}) {
  const r=(size-12)/2, circ=2*Math.PI*r, filled=circ*(pct/100)
  return (
    <div className="flex flex-col items-center">
      <div className="relative float" style={{width:size,height:size}}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:'rotate(-90deg)'}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={8}/>
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#prGrad)" strokeWidth={8} strokeLinecap="round"
            strokeDasharray={`${filled} ${circ}`}
            initial={{strokeDasharray:`0 ${circ}`}} animate={{strokeDasharray:`${filled} ${circ}`}}
            transition={{duration:1.2,ease:[0.34,1.2,0.64,1],delay:0.3}}/>
          <defs>
            <linearGradient id="prGrad" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="var(--primary)"/><stop offset="1" stopColor="var(--primary-light)"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="display font-bold" style={{fontSize:12,color:'var(--primary-light)',letterSpacing:'-0.04em'}}>{pct}%</span>
        </div>
      </div>
      <span className="mono" style={{fontSize:9,color:'var(--text-muted)',marginTop:4}}>complete</span>
    </div>
  )
}

export default function Profile() {
  const { isDemoMode, tryDemoMode, disconnect, demoProfile } = useWallet()
  const [lang,setLang] = useState('en')
  const [notifications,setNotifications] = useState(true)
  const [appLock,setAppLock] = useState(true)

  const displayName = isDemoMode ? demoProfile.workerName : 'Ravi Kumar'
  const displayId = isDemoMode ? demoProfile.workerId : 'GS-IND-22091'

  const handleDemoToggle = (nextValue) => {
    if (nextValue) {
      tryDemoMode()
      return
    }
    if (isDemoMode) {
      disconnect()
    }
  }

  const Toggle = ({value,onChange}) => (
    <button onClick={()=>onChange(!value)} className="btn-press relative" style={{width:40,height:22}}>
      <div className="absolute inset-0 rounded-full transition-all" style={{background:value?'var(--primary)':'var(--bg-elevated)',border:`1px solid ${value?'var(--primary)':'var(--border-default)'}`}}/>
      <motion.div className="absolute top-0.5 rounded-full" style={{width:18,height:18,background:'white',boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}}
        animate={{left:value?20:2}} transition={{type:'spring',stiffness:500,damping:35}}/>
    </button>
  )

  return (
    <div className="page-pad max-w-lg mx-auto">
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} className="mb-5 mt-2">
        <p className="mono mb-1" style={{fontSize:10,color:'var(--text-muted)',letterSpacing:'0.06em',textTransform:'uppercase'}}>Account</p>
        <h1 className="display font-bold" style={{fontSize:'clamp(24px,6vw,32px)',letterSpacing:'-0.03em',color:'var(--text-primary)'}}>Profile</h1>
      </motion.div>

      {/* Worker identity card */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
        className="grad-border p-5 mb-4" style={{borderRadius:16}}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center display font-bold flex-shrink-0"
            style={{background:'var(--primary-dim)',border:'1px solid var(--border-brand)',fontSize:24,color:'var(--primary-light)'}}>
            RK
          </div>
          <div className="flex-1 min-w-0">
            <p className="display font-bold" style={{fontSize:20,color:'var(--text-primary)',letterSpacing:'-0.025em'}}>{displayName}</p>
            <p className="mono" style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{displayId}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="pill pill-success" style={{fontSize:10}}><CheckCircle2 size={9}/>Level 2 Verified</span>
              <span className="pill pill-brand" style={{fontSize:10}}>EPF + ESI Eligible</span>
            </div>
          </div>
          <ProgressRing pct={72} size={72}/>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[{l:'Platforms',v:'3'},{l:'Days Worked',v:'42'},{l:'Benefits',v:'3/5'}].map((s,i)=>(
            <div key={i} className="rounded-xl p-2.5 text-center" style={{background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)'}}>
              <p className="display font-bold" style={{fontSize:15,color:'var(--primary-light)'}}>{s.v}</p>
              <p className="mono" style={{fontSize:9,color:'var(--text-muted)',marginTop:1}}>{s.l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Benefits unlocked */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
        className="rounded-2xl p-4 mb-3" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
        <p className="mono font-semibold mb-3" style={{fontSize:12,color:'var(--text-secondary)'}}>Benefits Unlocked</p>
        <div className="space-y-2">
          {[
            {name:'EPF – Provident Fund',desc:'Retirement savings',done:true},
            {name:'ESI – Health Insurance',desc:'Medical cover for you',done:true},
            {name:'Gratuity Protection',desc:'Long service benefit',done:false},
            {name:'Maternity Benefit',desc:'4 months full pay',done:false},
            {name:'Accident Insurance',desc:'On-job injury cover',done:false},
          ].map((b,i)=>(
            <div key={i} className="flex items-center gap-3 py-1.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:b.done?'var(--success-bg)':'var(--bg-elevated)',border:`1px solid ${b.done?'rgba(74,222,128,0.25)':'var(--border-subtle)'}`}}>
                {b.done?<CheckCircle2 size={13} style={{color:'#4ADE80'}}/>:<Lock size={11} style={{color:'var(--text-muted)'}}/>}
              </div>
              <div className="flex-1">
                <p className="display font-semibold" style={{fontSize:12,color:b.done?'var(--text-primary)':'var(--text-muted)'}}>{b.name}</p>
                <p className="mono" style={{fontSize:10,color:'var(--text-muted)',marginTop:1}}>{b.desc}</p>
              </div>
              {b.done&&<span className="pill pill-success" style={{fontSize:9}}>Active</span>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Language */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
        className="rounded-2xl p-4 mb-3" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
        <div className="flex items-center gap-2 mb-3">
          <Globe size={14} style={{color:'var(--text-muted)'}}/>
          <p className="mono font-semibold" style={{fontSize:12,color:'var(--text-secondary)'}}>Language · भाषा बदलें</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LANGS.map(l=>(
            <button key={l.code} onClick={()=>{setLang(l.code);toast.success(`Language: ${l.label}`)}}
              className="btn-press rounded-xl p-3 text-left transition-all"
              style={{background:lang===l.code?'var(--primary-dim)':'var(--bg-elevated)',border:`1px solid ${lang===l.code?'var(--border-brand)':'var(--border-subtle)'}`}}>
              <p className="display font-semibold" style={{fontSize:13,color:lang===l.code?'var(--primary-light)':'var(--text-primary)'}}>{l.native}</p>
              <p className="mono" style={{fontSize:10,color:'var(--text-muted)',marginTop:1}}>{l.label}</p>
              {lang===l.code&&<CheckCircle2 size={11} style={{color:'var(--primary-light)',marginTop:4}}/>}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.25}}
        className="rounded-2xl mb-3" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
        {[
          {label:'Notifications',sub:'Risk alerts and claim updates',icon:Bell,value:notifications,onChange:setNotifications},
          {label:'App Lock',sub:'Biometric/PIN security',icon:Lock,value:appLock,onChange:setAppLock},
          {label:'Demo Mode',sub:'Simulated data (hackathon)',icon:Smartphone,value:isDemoMode,onChange:(v)=>{handleDemoToggle(v);toast.success(v?'Demo mode ON – simulated data':'Demo mode OFF')}},
        ].map((item,i)=>(
          <div key={i} className="flex items-center gap-3 p-4" style={{borderBottom:i<2?'1px solid var(--border-subtle)':''}}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)'}}>
              <item.icon size={14} style={{color:'var(--text-muted)'}}/>
            </div>
            <div className="flex-1">
              <p className="display font-semibold" style={{fontSize:13,color:'var(--text-primary)'}}>{item.label}</p>
              <p className="mono" style={{fontSize:10,color:'var(--text-muted)',marginTop:1}}>{item.sub}</p>
            </div>
            <Toggle value={item.value} onChange={item.onChange}/>
          </div>
        ))}
      </motion.div>

      {/* Support */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
        className="rounded-2xl mb-3" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
        {[{label:'Help & FAQ',icon:HelpCircle},{label:'Privacy & Permissions',icon:Shield},{label:'Security Settings',icon:Lock}].map((item,i)=>(
          <button key={i} className="w-full flex items-center gap-3 p-4 btn-press" style={{borderBottom:i<2?'1px solid var(--border-subtle)':''}}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)'}}>
              <item.icon size={14} style={{color:'var(--text-muted)'}}/>
            </div>
            <span className="display font-semibold flex-1 text-left" style={{fontSize:13,color:'var(--text-primary)'}}>{item.label}</span>
            <ChevronRight size={14} style={{color:'var(--text-muted)'}}/>
          </button>
        ))}
      </motion.div>

      {/* About */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35}}
        className="text-center py-4">
        <p className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>GigSecure Chain · v2.0 · Polygon Amoy</p>
        <p className="mono mt-1" style={{fontSize:10,color:'var(--text-muted)'}}>Built for India's 23.5M gig workers</p>
      </motion.div>
    </div>
  )
}
