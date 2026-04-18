import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Zap, Brain, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Users, ShieldCheck, BarChart2, ChevronDown } from 'lucide-react'
import { AreaChart, Area, XAxis, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../utils/api'

const EARNINGS_DATA = [
  {day:'Mar 1',e:902,avg:880},{day:'Mar 5',e:871,avg:880},{day:'Mar 10',e:1014,avg:880},
  {day:'Mar 15',e:899,avg:880},{day:'Mar 18',e:1108,avg:880},{day:'Mar 19',e:463,avg:880},
  {day:'Mar 21',e:405,avg:880},{day:'Mar 23',e:201,avg:880},{day:'Mar 27',e:1559,avg:880},{day:'Mar 30',e:1352,avg:880},
]

const ChartTip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null
  const slump = payload[0]?.value<600
  return (
    <div className="glass px-3 py-2 rounded-xl mono text-xs" style={{border:`1px solid ${slump?'rgba(248,113,113,0.3)':'var(--border-brand)'}`}}>
      <p style={{fontSize:10,color:'var(--text-muted)',marginBottom:2}}>{label}</p>
      <p style={{color:slump?'#F87171':'var(--primary-light)',fontWeight:600,fontSize:12}}>₹{payload[0]?.value?.toLocaleString('en-IN')}</p>
      {slump&&<p style={{fontSize:10,color:'#F87171',marginTop:2}}>⚠ Slump day</p>}
    </div>
  )
}

function RiskGauge({score=67}) {
  const [displayed,setDisplayed] = useState(0)
  const color = score<=40?'#4ADE80':score<=70?'#FBBF24':'#F87171'
  const label = score<=40?'Low Risk':score<=70?'Moderate Risk':'High Risk'
  const sublabel = score<=40?'You\'re well protected this week':score<=70?'Your income may dip. Act now.':'High slump risk. Activate shield today.'

  useEffect(()=>{
    let start=0; const step=()=>{start+=2;if(start<=score){setDisplayed(start);requestAnimationFrame(step)}}
    const t=setTimeout(()=>requestAnimationFrame(step),400)
    return()=>clearTimeout(t)
  },[score])

  // SVG semi-circle gauge 180°
  const cx=110, cy=110, r=80
  const strokeW=12
  const arc = (pct,start=180,end=360) => {
    const startRad=(start*Math.PI)/180, endRad=(end*Math.PI)/180
    const x1=cx+r*Math.cos(startRad),y1=cy+r*Math.sin(startRad)
    const x2=cx+r*Math.cos(endRad), y2=cy+r*Math.sin(endRad)
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
  }
  const rotate = 180 + (score/100)*180
  const needleR = r * 0.45

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{width:220,height:130}}>
        <svg width="220" height="130" viewBox="0 0 220 130" style={{overflow:'visible'}}>
          {/* Background arc */}
          <path d={arc(1)} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={strokeW} strokeLinecap="round"/>
          {/* Green zone 0-40% */}
          <path d={arc(0.4,180,252)} fill="none" stroke="#4ADE80" strokeWidth={strokeW}/>
          {/* Amber zone 40-70% */}
          <path d={arc(0.3,252,306)} fill="none" stroke="#FBBF24" strokeWidth={strokeW}/>
          {/* Red zone 70-100% */}
          <path d={arc(0.3,306,360)} fill="none" stroke="#F87171" strokeWidth={strokeW}/>
          {/* Filled arc */}
          <motion.path d={arc(1)} fill="none" stroke={`url(#gaugeGrad)`} strokeWidth={strokeW} strokeLinecap="round"
            strokeDasharray={`${(score/100)*Math.PI*r} ${Math.PI*r}`}
            initial={{strokeDasharray:`0 ${Math.PI*r}`}}
            animate={{strokeDasharray:`${(score/100)*Math.PI*r} ${Math.PI*r}`}}
            transition={{duration:1.4,ease:[0.34,1.2,0.64,1],delay:0.4}}/>
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#4ADE80"/>
              <stop offset="0.5" stopColor="#FBBF24"/>
              <stop offset="1" stopColor={color}/>
            </linearGradient>
          </defs>
          {/* Needle */}
          <motion.line
            x1={cx} y1={cy-18}
            x2={cx+needleR*Math.cos((rotate*Math.PI)/180)}
            y2={cy+needleR*Math.sin((rotate*Math.PI)/180)}
            stroke={color} strokeWidth={2.5} strokeLinecap="round"
            initial={{x2:cx+needleR*Math.cos(Math.PI),y2:cy}}
            animate={{x2:cx+needleR*Math.cos((rotate*Math.PI)/180),y2:cy+needleR*Math.sin((rotate*Math.PI)/180)}}
            transition={{duration:1.4,ease:[0.34,1.2,0.64,1],delay:0.4}}/>
          <circle cx={cx} cy={cy-18} r={5} fill={color}/>
          {/* Score text */}
          <text x={cx} y="117" textAnchor="middle" dominantBaseline="middle" fill={color} style={{fontSize:32,fontFamily:'Sora',fontWeight:700,letterSpacing:'-0.04em'}}>{displayed}</text>
        </svg>
      </div>
      <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:1.1}} className="text-center mt-1">
        <p className="display font-bold" style={{fontSize:16,color,letterSpacing:'-0.02em'}}>{label}</p>
        <p className="mono mt-1" style={{fontSize:11,color:'var(--text-muted)'}}>{sublabel}</p>
      </motion.div>
    </div>
  )
}

export default function SlumpShield() {
  const [activated,setActivated] = useState(false)
  const [showPool,setShowPool] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true)
      try {
        const res = await api.post('/slump/predict', {
          earnings: [902, 871, 1014, 899, 1108, 463, 405, 201, 1559, 1352],
          platforms: ['Swiggy', 'Uber', 'Zomato'],
          workerName: 'Demo Worker'
        })
        setResult(res.data)
      } catch (error) {
        toast.error(error?.response?.data?.error || 'Failed to fetch slump prediction')
      } finally {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [])

  const activateShield = () => {
    setActivated(true)
    toast.success('Shield activated. ₹400/day coverage unlocked.')
  }

  return (
    <div className="page-pad max-w-lg mx-auto">
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} className="mb-5 mt-2">
        <p className="mono mb-1" style={{fontSize:10,color:'var(--text-muted)',letterSpacing:'0.06em',textTransform:'uppercase'}}>AI-Powered Protection</p>
        <h1 className="display font-bold" style={{fontSize:'clamp(24px,6vw,32px)',letterSpacing:'-0.03em',color:'var(--text-primary)'}}>
          Slump <span style={{color:'var(--secondary)'}}>Shield</span>
        </h1>
        <p className="mono mt-1" style={{fontSize:12,color:'var(--text-muted)'}}>AI watches your income so you don't have to</p>
      </motion.div>

      {/* Risk Gauge */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
        className="rounded-2xl p-5 mb-3" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
        <div className="flex items-center justify-between mb-4">
          <p className="mono font-semibold" style={{fontSize:12,color:'var(--text-secondary)'}}>Income Risk Score</p>
          <span className="pill" style={{fontSize:10,color:'var(--text-muted)'}}>Last 30 days</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{borderColor:'var(--primary)',borderTopColor:'transparent'}}/>
            <span className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>Analyzing income trend...</span>
          </div>
        ) : (
          <RiskGauge score={result?.riskScore?.score ?? 0}/>
        )}
      </motion.div>

      {/* Earnings chart */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
        className="rounded-2xl mb-3" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
        <div className="p-4 pb-2 flex items-center justify-between">
          <div>
            <p className="mono font-semibold" style={{fontSize:12,color:'var(--text-secondary)'}}>Earnings Trend</p>
            <p className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>Red dots = slump days</p>
          </div>
          <div className="flex items-center gap-1 pill pill-warning">
            <TrendingDown size={9}/><span style={{fontSize:10}}>Slump detected</span>
          </div>
        </div>
        <div style={{height:130,padding:'4px 16px 12px'}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={EARNINGS_DATA} margin={{top:5,right:0,bottom:0,left:0}}>
              <defs>
                <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--secondary)" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{fill:'#475569',fontSize:9,fontFamily:'JetBrains Mono'}} axisLine={false} tickLine={false}/>
              <ReferenceLine y={880} stroke="rgba(148,163,184,0.2)" strokeDasharray="4 4" label={{value:'Avg',fill:'#475569',fontSize:9,fontFamily:'JetBrains Mono'}}/>
              <Tooltip content={<ChartTip/>}/>
              <Area type="monotone" dataKey="e" stroke="var(--secondary)" strokeWidth={2} fill="url(#sGrad)"
                dot={(p)=><circle key={p.payload.day} cx={p.cx} cy={p.cy} r={4}
                  fill={p.payload.e<600?'#F87171':'var(--secondary)'} stroke="var(--bg-card)" strokeWidth={1.5}/>}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* AI Insight card */}
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
        className="rounded-2xl p-4 mb-3" style={{background:'linear-gradient(135deg,var(--bg-card),#0E101A)',border:'1px solid rgba(99,102,241,0.2)'}}>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.25)'}}>
            <Brain size={16} style={{color:'#818CF8'}}/>
          </div>
          <div>
            <p className="display font-semibold" style={{fontSize:13,color:'var(--text-primary)'}}>AI Forecast</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="mono" style={{fontSize:9,color:'var(--text-muted)'}}>Groq · llama3-70b</span>
              <span className="mono" style={{fontSize:9,color:'var(--text-muted)'}}>· Updated 2h ago</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {result ? (
            <p className="mono" style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.55}}>{result?.aiAdvice}</p>
          ) : (
            <div className="space-y-2">
              <div className="h-3 rounded animate-pulse" style={{background:'rgba(148,163,184,0.2)'}} />
              <div className="h-3 rounded animate-pulse" style={{background:'rgba(148,163,184,0.2)'}} />
              <div className="h-3 rounded animate-pulse" style={{background:'rgba(148,163,184,0.2)'}} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Action cards */}
      {!activated ? (
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="space-y-2">
          {result?.recommendation === 'ACTIVATE_SLUMP_SHIELD' ? (
            <button onClick={activateShield} className="w-full btn-press rounded-2xl p-4 text-left"
              style={{background:'linear-gradient(135deg,var(--primary),#0D7A70)',boxShadow:'0 8px 24px rgba(13,148,136,0.28)'}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10">
                  <ShieldCheck size={20} style={{color:'white'}}/>
                </div>
                <div className="flex-1">
                  <p className="display font-bold" style={{fontSize:15,color:'white',letterSpacing:'-0.02em'}}>Join Peer Risk Pool</p>
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.7)',fontFamily:'JetBrains Mono',marginTop:2}}>₹{Math.round((result?.riskScore?.avg || 400))} per day if earnings drop below ₹500 for 3 days</p>
                </div>
                <Zap size={18} style={{color:'rgba(255,255,255,0.7)'}}/>
              </div>
            </button>
          ) : result?.recommendation === 'MONITOR' ? (
            <div className="w-full rounded-2xl p-4" style={{background:'var(--success-bg)',border:'1px solid rgba(74,222,128,0.25)'}}>
              <p className="display font-bold" style={{fontSize:15,color:'#4ADE80'}}>Income looks stable. Shield on standby.</p>
            </div>
          ) : null}

          <button onClick={()=>setShowPool(true)} className="w-full btn-press rounded-2xl p-4 text-left"
            style={{background:'var(--bg-card)',border:'1px solid var(--border-amber)'}}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'var(--secondary-dim)',border:'1px solid var(--border-amber)'}}>
                <BarChart2 size={18} style={{color:'var(--secondary)'}}/>
              </div>
              <div className="flex-1">
                <p className="display font-semibold" style={{fontSize:14,color:'var(--text-primary)'}}>Pre-qualify for Insurance</p>
                <p className="mono" style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>Takes 30 seconds. No premium upfront.</p>
              </div>
            </div>
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{type:'spring',stiffness:300}}
          className="rounded-2xl p-5" style={{background:'var(--success-bg)',border:'1px solid rgba(74,222,128,0.25)'}}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(74,222,128,0.15)'}}>
              <CheckCircle2 size={20} style={{color:'#4ADE80'}}/>
            </div>
            <div>
              <p className="display font-bold" style={{fontSize:15,color:'#4ADE80'}}>Slump Shield Activated</p>
              <p className="mono" style={{fontSize:11,color:'rgba(74,222,128,0.7)',marginTop:2}}>₹400/day coverage unlocked</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              {l:'Daily Cover',v:`₹${Math.round((result?.riskScore?.avg || 400))}`},
              {l:'Max Payout',v:`₹${(result?.suggestedInsuranceAmount || 15000).toLocaleString('en-IN')}`},
              {l:'Trigger',v:'3 days'},
              {l:'Pool Size',v:'247'},
              {l:'Status',v:'Active'},
              {l:'Expires',v:'30 days'}
            ].map((s,i)=>(
              <div key={i} className="rounded-xl p-2.5 text-center" style={{background:'rgba(74,222,128,0.08)',border:'1px solid rgba(74,222,128,0.15)'}}>
                <p className="display font-bold" style={{fontSize:13,color:'#4ADE80'}}>{s.v}</p>
                <p className="mono" style={{fontSize:9,color:'rgba(74,222,128,0.6)',marginTop:1}}>{s.l}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Users size={12} style={{color:'rgba(74,222,128,0.7)'}}/>
            <span className="mono" style={{fontSize:10,color:'rgba(74,222,128,0.7)'}}>247 workers in your risk pool · Polygon Amoy</span>
          </div>
        </motion.div>
      )}

      {/* Past slumps */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="mt-3">
        <button onClick={()=>setShowPool(p=>!p)} className="w-full flex items-center justify-between p-4 rounded-xl btn-press"
          style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
          <span className="mono font-semibold" style={{fontSize:12,color:'var(--text-secondary)'}}>Past slump events</span>
          <ChevronDown size={14} style={{color:'var(--text-muted)',transform:showPool?'rotate(180deg)':'',transition:'transform 0.2s'}}/>
        </button>
        <AnimatePresence>
          {showPool&&(
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
              className="overflow-hidden">
              {[{date:'Feb 10–14',drop:'65%',claimed:'₹2,000',status:'paid'},{date:'Jan 3–5',drop:'42%',claimed:'₹1,200',status:'paid'}].map((s,i)=>(
                <div key={i} className="flex items-center gap-3 p-3 mt-1 rounded-xl" style={{background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)'}}>
                  <TrendingDown size={14} style={{color:'#F87171',flexShrink:0}}/>
                  <div className="flex-1">
                    <p className="mono" style={{fontSize:12,color:'var(--text-secondary)'}}>{s.date} · {s.drop} drop</p>
                    <p className="mono" style={{fontSize:10,color:'var(--text-muted)',marginTop:1}}>Claimed: {s.claimed}</p>
                  </div>
                  <span className="pill pill-success" style={{fontSize:10}}>Paid</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
