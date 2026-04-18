import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWallet } from '../context/WalletContext'
import { Shield, Zap, FileText, AlertTriangle, IndianRupee, Calendar, Layers, TrendingUp, TrendingDown, ArrowRight, Activity, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

const EARNINGS = [
  { day:'Mar 1',e:902},{day:'Mar 5',e:871},{day:'Mar 10',e:1014},
  {day:'Mar 15',e:899},{day:'Mar 19',e:1108},{day:'Mar 20',e:463},
  {day:'Mar 22',e:405},{day:'Mar 25',e:201},{day:'Mar 27',e:1559},{day:'Mar 30',e:1352},
]
const ACTIVITY = [
  { text:'Gig Passport minted on Polygon Amoy', time:'2h ago', ok:true },
  { text:'Slump Shield activated — ₹15,000 payout unlocked', time:'5h ago', ok:false },
  { text:'EPF eligibility reached — 6 month threshold', time:'1d ago', ok:true },
  { text:'Slump Survivor Badge #001 minted', time:'2d ago', ok:true },
]
const QUICK = [
  { label:'Gig Passport', sub:'On-chain identity', icon:Shield, path:'/passport', color:'#14B8A6' },
  { label:'Slump Shield', sub:'AI risk analysis',  icon:Zap,    path:'/slump-shield', color:'#FBBF24' },
  { label:'File a Claim', sub:'Benefits payout',   icon:FileText, path:'/claims', color:'#A78BFA' },
]

const ChartTip = ({active,payload}) => {
  if(!active||!payload?.length) return null
  return (
    <div className="glass px-3 py-2 rounded-xl mono text-xs" style={{border:'1px solid var(--border-default)'}}>
      <p style={{color:'var(--secondary)',fontWeight:600}}>₹{payload[0].value.toLocaleString('en-IN')}</p>
    </div>
  )
}

function ProtectionRing({score=50}) {
  const R=44, circ=2*Math.PI*R
  const filled=circ*(score/100)
  const color = score>=75?'#14B8A6':score>=50?'#F59E0B':'#EF4444'
  const label = score>=75?'Well Protected':score>=50?'Partially Protected':'At Risk'
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative float" style={{width:140,height:140}}>
        <div className="absolute inset-0 rounded-full" style={{boxShadow:`0 0 32px ${color}30,0 0 64px ${color}12`}}/>
        <svg viewBox="0 0 100 100" width="140" height="140" style={{transform:'rotate(-90deg)'}}>
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="8"/>
          <motion.circle cx="50" cy="50" r={R} fill="none" stroke={`url(#rg${score})`} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${filled} ${circ}`}
            initial={{strokeDasharray:`0 ${circ}`}} animate={{strokeDasharray:`${filled} ${circ}`}}
            transition={{duration:1.4,ease:[0.34,1.2,0.64,1],delay:0.4}}/>
          <defs>
            <linearGradient id={`rg${score}`} x1="0" y1="0" x2="1" y2="0">
              <stop stopColor={score>=50?'#F59E0B':'#EF4444'}/>
              <stop offset="1" stopColor={color}/>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}} transition={{delay:0.9,type:'spring'}}
            className="display font-bold" style={{fontSize:30,color,letterSpacing:'-0.04em',lineHeight:1}}>
            {score}
          </motion.span>
          <span className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>/ 100</span>
        </div>
      </div>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1}}
        className="mono text-xs font-semibold mt-2" style={{color}}>{label}</motion.p>
      <p className="mono text-center mt-1" style={{fontSize:10,color:'var(--text-muted)',lineHeight:1.4}}>EPF + ESI eligible · Gratuity pending</p>
    </div>
  )
}

function BCard({children,className='',style={},delay=0,onClick}) {
  return (
    <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}
      transition={{delay,duration:0.45,ease:[0.22,1,0.36,1]}}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',...style}}>
      {children}
    </motion.div>
  )
}

function KPIStat({label,value,sub,icon:Icon,trend,delay}) {
  const up = trend==='up'
  return (
    <BCard className="p-4" delay={delay}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'var(--primary-dim)',border:'1px solid var(--border-brand)'}}>
          <Icon size={15} style={{color:'var(--primary-light)'}}/>
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 pill ${up?'pill-success':'pill-red'}`}>
            {up?<TrendingUp size={9}/>:<TrendingDown size={9}/>}
            <span>{sub}</span>
          </div>
        )}
      </div>
      <p className="display font-bold" style={{fontSize:22,letterSpacing:'-0.03em',color:'var(--text-primary)'}}>{value}</p>
      <p className="mono mt-0.5" style={{fontSize:11,color:'var(--text-muted)'}}>{label}</p>
    </BCard>
  )
}

export default function Dashboard() {
  const { account, connectWallet, disconnect, isConnecting, isDemoMode, demoProfile } = useWallet()
  const [time,setTime] = useState(new Date())
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t)},[])
  const hour=time.getHours()
  const greeting=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening'
  const workerName = isDemoMode ? demoProfile.workerName.split(' ')[0] : 'Ravi'
  const walletLabel = isDemoMode
    ? 'Demo Mode'
    : account
      ? `${account.slice(0,6)}…${account.slice(-4)}`
      : (isConnecting ? 'Connecting…' : 'Connect Wallet')

  return (
    <div className="page-pad max-w-lg mx-auto">
      {/* Top greeting */}
      <div className="flex items-end justify-between mt-2 mb-5">
        <motion.div initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{duration:0.4}}>
          <p className="mono" style={{fontSize:11,color:'var(--text-muted)',marginBottom:2}}>
            {time.toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'short'})}
          </p>
          <h1 className="display font-bold" style={{fontSize:'clamp(22px,5vw,28px)',letterSpacing:'-0.03em'}}>
            <span style={{color:'var(--text-muted)'}}>{greeting}, </span>
            <span style={{color:'var(--text-primary)'}}>{workerName} 👋</span>
          </h1>
        </motion.div>
        <motion.button initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{duration:0.4,delay:0.1}}
          onClick={isDemoMode ? disconnect : connectWallet} disabled={isConnecting}
          className="flex items-center gap-1.5 btn-press" style={{background:'var(--bg-elevated)',border:'1px solid var(--border-amber)',borderRadius:10,padding:'8px 12px'}}>
          <div className={`w-1.5 h-1.5 rounded-full ${account?'bg-emerald-400 animate-pulse':'bg-amber-400'}`}/>
          <span className="mono" style={{fontSize:11,color:account?'#4ADE80':'var(--secondary)'}}>
            {walletLabel}
          </span>
        </motion.button>
      </div>

      {/* Alert banner */}
      <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
        className="mb-4 flex items-center justify-between rounded-xl px-4 py-3"
        style={{background:'rgba(220,38,38,0.08)',border:'1px solid rgba(248,113,113,0.2)'}}>
        <div className="flex items-center gap-2.5">
          <AlertTriangle size={15} style={{color:'#F87171',flexShrink:0}}/>
          <div>
            <p className="mono font-semibold" style={{fontSize:12,color:'#F87171'}}>Income slump detected</p>
            <p className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>Days 20–25 dropped 78% below average</p>
          </div>
        </div>
        <Link to="/slump-shield" className="flex items-center gap-1 mono btn-press" style={{fontSize:11,color:'#F87171'}}>
          Fix <ArrowRight size={10}/>
        </Link>
      </motion.div>

      {/* Protection ring + stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <BCard className="col-span-2 p-5" delay={0.15} style={{background:'var(--bg-card)'}}>
          <div className="flex items-center justify-between mb-1">
            <p className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>Protection Score</p>
            <span className="pill pill-success"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"/>Live</span>
          </div>
          <div className="flex items-center gap-6 mt-3">
            <ProtectionRing score={68}/>
            <div className="flex-1 space-y-3">
              {[{l:'EPF Status',v:'Eligible',ok:true},{l:'ESI Status',v:'Eligible',ok:true},{l:'Gratuity',v:'Pending',ok:false},{l:'Platforms',v:'3 active',ok:true}].map((item,i)=>(
                <div key={i} className="flex items-center justify-between">
                  <span className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>{item.l}</span>
                  <span className={`pill ${item.ok?'pill-success':'pill-warning'}`} style={{fontSize:10}}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/claims" className="flex items-center gap-1 justify-end mt-3 mono btn-press" style={{fontSize:11,color:'var(--primary-light)'}}>
            View full breakdown <ChevronRight size={11}/>
          </Link>
        </BCard>

        <KPIStat label="This Month" value="₹30,213" sub="+12%" trend="up" icon={IndianRupee} delay={0.2}/>
        <KPIStat label="Days Worked" value="28/30" sub="Mar 26" trend="up" icon={Calendar} delay={0.22}/>
        <KPIStat label="Platforms" value="3" sub="Active" icon={Layers} delay={0.24}/>
        <KPIStat label="Benefits Paid" value="₹2,000" sub="+₹2k" trend="up" icon={Shield} delay={0.26}/>
      </div>

      {/* Earnings chart */}
      <BCard className="mb-3" delay={0.3}>
        <div className="p-4 pb-2 flex items-center justify-between">
          <div>
            <p className="mono font-semibold" style={{fontSize:12,color:'var(--text-secondary)'}}>Earnings · March 2026</p>
            <p className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>₹30,213 total · slump days highlighted</p>
          </div>
          <div className="flex items-center gap-3 mono" style={{fontSize:10}}>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{background:'var(--primary-light)'}}/>Normal</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-red-400"/>Slump</span>
          </div>
        </div>
        <div style={{height:130,padding:'0 16px 12px'}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={EARNINGS} margin={{top:5,right:0,bottom:0,left:0}}>
              <defs>
                <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25}/>
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{fill:'#475569',fontSize:9,fontFamily:'JetBrains Mono'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTip/>}/>
              <Area type="monotone" dataKey="e" stroke="var(--primary-light)" strokeWidth={2} fill="url(#eGrad)"
                dot={(p)=><circle key={p.payload.day} cx={p.cx} cy={p.cy} r={3.5}
                  fill={p.payload.e<600?'#F87171':'var(--primary-light)'} stroke="var(--bg-card)" strokeWidth={1.5}/>}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </BCard>

      {/* Quick actions */}
      <BCard className="mb-3 p-4" delay={0.35}>
        <p className="mono mb-3" style={{fontSize:11,color:'var(--text-muted)'}}>Quick actions</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK.map((q,i)=>(
            <Link key={i} to={q.path} className="card-lift rounded-xl p-3 flex flex-col gap-2" style={{background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)'}}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:`${q.color}18`,border:`1px solid ${q.color}30`}}>
                <q.icon size={15} style={{color:q.color}}/>
              </div>
              <div>
                <p className="display font-semibold" style={{fontSize:12,color:'var(--text-primary)',lineHeight:1.3}}>{q.label}</p>
                <p className="mono" style={{fontSize:10,color:'var(--text-muted)',marginTop:2}}>{q.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </BCard>

      {/* Activity feed */}
      <BCard className="mb-2 p-4" delay={0.4}>
        <div className="flex items-center justify-between mb-3">
          <p className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>Recent activity</p>
          <Activity size={13} style={{color:'var(--text-muted)'}}/>
        </div>
        {ACTIVITY.map((item,i)=>(
          <div key={i} className="flex items-start gap-3 py-2.5" style={{borderBottom:i<ACTIVITY.length-1?'1px solid var(--border-subtle)':''}}>
            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{background:item.ok?'#4ADE80':'#FBBF24'}}/>
            <div className="flex-1 min-w-0">
              <p className="mono" style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.4}}>{item.text}</p>
              <p className="mono" style={{fontSize:10,color:'var(--text-muted)',marginTop:2}}>{item.time}</p>
            </div>
            {item.ok
              ?<CheckCircle2 size={13} style={{color:'#4ADE80',flexShrink:0,marginTop:2}}/>
              :<AlertTriangle size={13} style={{color:'#FBBF24',flexShrink:0,marginTop:2}}/>}
          </div>
        ))}
      </BCard>

      {/* Policy badge */}
      <BCard className="p-4 mb-2" delay={0.45} style={{background:'linear-gradient(135deg,var(--bg-card),#141410)'}}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl float flex items-center justify-center flex-shrink-0" style={{background:'var(--secondary-dim)',border:'1px solid var(--border-amber)'}}>
            <Sparkles size={18} style={{color:'var(--secondary)'}}/>
          </div>
          <div className="flex-1">
            <p className="display font-bold" style={{fontSize:14,color:'var(--text-primary)',letterSpacing:'-0.02em'}}>India Social Security 2020</p>
            <p className="mono mt-0.5" style={{fontSize:10,color:'var(--text-muted)',lineHeight:1.5}}>23.5M gig workers. GigSecure is the missing infrastructure.</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            <span className="mono" style={{fontSize:10,color:'#4ADE80'}}>2026</span>
          </div>
        </div>
      </BCard>
    </div>
  )
}
