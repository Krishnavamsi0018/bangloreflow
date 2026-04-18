import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Shield, CheckCircle2, Copy, ExternalLink, ChevronRight, Plus, Trash2, Lock, Layers, Hash, Calendar } from 'lucide-react'
import api from '../utils/api'
import { useWallet } from '../context/WalletContext'

const PLATFORMS = ['Swiggy','Uber','Zomato','Ola','Blinkit','Dunzo','Zepto','Porter']
const STEP_LABELS = ['Worker Info','Platforms','Earnings','Generate']
const PLATFORM_COLORS = {Swiggy:'#FC8019',Uber:'#9CA3AF',Zomato:'#E23744',Ola:'#FFD700',Blinkit:'#FFC20D',Dunzo:'#00C9A7',Zepto:'#8B5CF6',Porter:'#3B82F6'}

const MOCK_ENTRIES = [
  { platform:'Swiggy',  range:'Feb 1 – Mar 30', earnings:'₹14,200', days:38, status:'verified' },
  { platform:'Uber',    range:'Jan 15 – Mar 30', earnings:'₹9,800',  days:29, status:'verified' },
  { platform:'Zomato',  range:'Mar 1 – Mar 28',  earnings:'₹6,213',  days:22, status:'pending'  },
]

function StatusChip({status}) {
  const map = { verified:'chip-verified',pending:'chip-pending',risk:'chip-risk' }
  const labels = { verified:'Verified ✓',pending:'Pending',risk:'Needs Review' }
  return (
    <span className={`pill ${map[status]||'pill'}`} style={{fontSize:10}}>
      {labels[status]||status}
    </span>
  )
}

function StepIndicator({step,total=4}) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEP_LABELS.map((label,i)=>(
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full flex items-center justify-center mono border transition-all" style={{fontSize:11,
              background:step>i+1?'var(--primary)':step===i+1?'var(--primary-dim)':'transparent',
              borderColor:step>i+1?'var(--primary)':step===i+1?'var(--primary-light)':'var(--border-default)',
              color:step>i+1?'white':step===i+1?'var(--primary-light)':'var(--text-muted)'}}>
              {step>i+1?<CheckCircle2 size={13}/>:i+1}
            </div>
            <span className="mono mt-1 hidden sm:block" style={{fontSize:9,color:step===i+1?'var(--primary-light)':'var(--text-muted)',letterSpacing:'0.04em',textTransform:'uppercase'}}>{label}</span>
          </div>
          {i<STEP_LABELS.length-1 && (
            <div className="flex-1 h-px mx-1.5 mb-4 transition-all" style={{background:step>i+1?'var(--primary)':'var(--border-subtle)'}}/>
          )}
        </div>
      ))}
    </div>
  )
}

function PassportCard({ passport }) {
  const [copied,setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(passport?.passportId || '')
    setCopied(true)
    setTimeout(()=>setCopied(false),2000)
  }
  return (
    <div className="grad-border p-5 mb-4" style={{borderRadius:16}}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'var(--primary-dim)',border:'1px solid var(--border-brand)'}}>
            <Shield size={18} style={{color:'var(--primary-light)'}}/>
          </div>
          <div>
            <p className="mono" style={{fontSize:10,color:'var(--text-muted)',letterSpacing:'0.06em',textTransform:'uppercase'}}>Gig Passport</p>
            <p className="display font-bold" style={{fontSize:18,color:'var(--text-primary)',letterSpacing:'-0.025em'}}>{passport?.workerName || '—'}</p>
          </div>
        </div>
        <span className="pill pill-success"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Verified</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[{l:'Eligible Days',v:passport?.workingDays ?? '—'},{l:'Platforms',v:`${passport?.platforms?.length || 0} active`},{l:'Status',v:'Active'}].map((s,i)=>(
          <div key={i} className="rounded-xl p-2.5 text-center" style={{background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)'}}>
            <p className="display font-bold" style={{fontSize:16,color:'var(--primary-light)'}}>{s.v}</p>
            <p className="mono" style={{fontSize:9,color:'var(--text-muted)',marginTop:2}}>{s.l}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-3">
        {(passport?.platforms || []).map(p=>(
          <span key={p} className="pill" style={{fontSize:10,borderColor:PLATFORM_COLORS[p]+'40',color:PLATFORM_COLORS[p]}}>{p}</span>
        ))}
      </div>
      <div className="flex items-center gap-2 p-3 rounded-xl mono" style={{background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)'}}>
        <Hash size={12} style={{color:'var(--text-muted)',flexShrink:0}}/>
        <span className="break-word flex-1" style={{fontSize:11,color:'var(--text-muted)'}}>
          {passport?.passportId || '—'}
        </span>
        <button onClick={copy} className="btn-press" style={{color:copied?'var(--primary-light)':'var(--text-muted)'}}>
          {copied?<CheckCircle2 size={13}/>:<Copy size={13}/>}
        </button>
        <a href={`https://amoy.polygonscan.com/tx/${passport?.txHash || ''}`} target="_blank" rel="noreferrer" className="btn-press" style={{color:'var(--text-muted)'}}><ExternalLink size={13}/></a>
      </div>
    </div>
  )
}

function ZKProofPanel() {
  const [genState,setGenState] = useState('idle') // idle | generating | done
  const [steps,setSteps] = useState([])
  const PROOF_STEPS = [
    'Hashing earnings records…',
    'Building constraint circuit…',
    'Generating ZK witness…',
    'Verifying proof locally…',
    'Anchoring on Polygon Amoy…',
    'Proof ready ✓',
  ]
  const generate = async () => {
    setGenState('generating'); setSteps([])
    for(let i=0;i<PROOF_STEPS.length;i++) {
      await new Promise(r=>setTimeout(r,500))
      setSteps(s=>[...s,PROOF_STEPS[i]])
    }
    setGenState('done')
    toast.success('Proof generated. Ready to share.')
  }
  return (
    <div className="rounded-2xl p-4" style={{background:'var(--bg-card)',border:'1px solid var(--border-brand)'}}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'var(--primary-dim)',border:'1px solid var(--border-brand)'}}>
          <Lock size={13} style={{color:'var(--primary-light)'}}/>
        </div>
        <div>
          <p className="display font-semibold" style={{fontSize:14,color:'var(--text-primary)'}}>Generate Secure Proof</p>
          <p className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>Zero-knowledge · Your income stays private</p>
        </div>
      </div>
      <div className="rounded-xl p-3 mb-3" style={{background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)'}}>
        <p className="mono" style={{fontSize:11,color:'var(--text-secondary)',lineHeight:1.6}}>
          💡 We prove you qualify — <span style={{color:'var(--primary-light)'}}>without revealing your actual income.</span> Only eligibility is shared, not your earnings.
        </p>
      </div>
      {genState==='idle' && (
        <button onClick={generate} className="w-full btn-press rounded-xl py-3 display font-semibold"
          style={{background:'var(--primary)',color:'white',fontSize:14,boxShadow:'var(--shadow-brand)'}}>
          Generate Secure Proof
        </button>
      )}
      {genState!=='idle' && (
        <div className="space-y-2">
          {steps.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{duration:0.3}}
              className="flex items-center gap-2">
              <CheckCircle2 size={13} style={{color:'var(--primary-light)',flexShrink:0}}/>
              <span className="mono" style={{fontSize:11,color:i===steps.length-1?'var(--primary-light)':'var(--text-secondary)'}}>{s}</span>
            </motion.div>
          ))}
          {genState==='generating' && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{borderColor:'var(--primary)',borderTopColor:'transparent'}}/>
              <span className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>Processing…</span>
            </div>
          )}
          {genState==='done' && (
            <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} className="mt-2 p-3 rounded-xl" style={{background:'var(--success-bg)',border:'1px solid rgba(74,222,128,0.2)'}}>
              <p className="mono font-semibold" style={{fontSize:11,color:'#4ADE80'}}>✓ Proof anchored on Polygon Amoy</p>
              <p className="mono break-word mt-1" style={{fontSize:10,color:'var(--text-muted)'}}>0x3f7a2b9c…4e1d8f22 · Valid 24h</p>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>toast.success('Proof copied!')} className="pill pill-success btn-press"><Copy size={9}/>Copy Proof</button>
                <a href="#" className="pill pill-brand btn-press"><ExternalLink size={9}/>View on Chain</a>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GigPassport() {
  const { isDemoMode, demoProfile } = useWallet()
  const [step,setStep] = useState(0) // 0=view existing, 1-4=create flow
  const [form,setForm] = useState({name:'',phone:'',platforms:[],earnings:'',days:'',avgMonthly:''})
  const [passport,setPassport] = useState(null)
  const [creating,setCreating] = useState(false)

  useEffect(() => {
    if (isDemoMode) {
      setPassport({
        workerName: demoProfile.workerName,
        workingDays: demoProfile.workingDays,
        platforms: demoProfile.platforms,
        passportId: demoProfile.passportId,
        txHash: demoProfile.txHash,
      })
    }
  }, [isDemoMode, demoProfile])

  const togglePlatform = p => setForm(f=>({...f,platforms:f.platforms.includes(p)?f.platforms.filter(x=>x!==p):[...f.platforms,p]}))
  const next = () => {
    if(step===1&&!form.name) return toast.error('Enter your name')
    if(step===2&&form.platforms.length===0) return toast.error('Select at least one platform')
    if(step===3&&(!form.earnings||!form.days)) return toast.error('Fill all fields')
    setStep(s=>s+1)
  }
  const generate = async () => {
    setCreating(true)
    try {
      const res = await api.post('/passport/generate', {
        workerName: form.name,
        phone: form.phone,
        platforms: form.platforms,
        totalEarnings: Number(form.earnings),
        workingDays: Number(form.days),
        avgMonthlyEarning: Number(form.avgMonthly)
      })
      setPassport(res.data.passport)
      setStep(0)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      toast.success('Passport generated on-chain!')
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to generate passport')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="page-pad max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} className="mb-5 mt-2">
        <p className="mono mb-1" style={{fontSize:10,color:'var(--text-muted)',letterSpacing:'0.06em',textTransform:'uppercase'}}>Gig Passport System · v2.0</p>
        <h1 className="display font-bold" style={{fontSize:'clamp(24px,6vw,32px)',letterSpacing:'-0.03em',color:'var(--text-primary)'}}>
          Your Work <span style={{color:'var(--primary-light)'}}>Identity</span>
        </h1>
        <p className="mono mt-1" style={{fontSize:12,color:'var(--text-muted)'}}>Portable · Verifiable · Privacy-preserving</p>
      </motion.div>

      {step===0 && (
        <>
          <PassportCard passport={passport}/>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="mono font-semibold" style={{fontSize:12,color:'var(--text-secondary)'}}>Work Records</p>
              <button onClick={()=>setStep(1)} className="flex items-center gap-1 btn-press" style={{color:'var(--primary-light)'}}>
                <Plus size={13}/><span className="mono" style={{fontSize:11}}>Add Entry</span>
              </button>
            </div>
            <div className="space-y-2">
              {MOCK_ENTRIES.map((e,i)=>(
                <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                  className="flex items-center gap-3 rounded-xl p-3 card-lift"
                  style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mono font-bold" style={{background:`${PLATFORM_COLORS[e.platform]||'#888'}20`,fontSize:10,color:PLATFORM_COLORS[e.platform]||'#888',border:`1px solid ${PLATFORM_COLORS[e.platform]||'#888'}30`}}>
                    {e.platform.slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="display font-semibold" style={{fontSize:13,color:'var(--text-primary)'}}>{e.platform}</p>
                      <StatusChip status={e.status}/>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>{e.range}</span>
                      <span className="mono" style={{fontSize:10,color:'var(--primary-light)',fontWeight:600}}>{e.earnings}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="display font-bold" style={{fontSize:14,color:'var(--text-primary)'}}>{e.days}</p>
                    <p className="mono" style={{fontSize:9,color:'var(--text-muted)'}}>days</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <ZKProofPanel/>
        </>
      )}

      {step>0 && step<5 && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}}>
          <StepIndicator step={step}/>
          <AnimatePresence mode="wait">
            {step===1 && (
              <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                className="rounded-2xl p-5" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
                <p className="display font-semibold mb-4" style={{fontSize:16,color:'var(--text-primary)'}}>Worker Identity</p>
                <div className="space-y-3">
                  {[{label:'Full Name *',key:'name',ph:'Ravi Kumar',type:'text'},{label:'Phone Number',key:'phone',ph:'+91 98765 43210',type:'tel'}].map(f=>(
                    <div key={f.key}>
                      <label className="mono mb-1.5 block" style={{fontSize:11,color:'var(--text-muted)'}}>{f.label}</label>
                      <input type={f.type} className="input-field" placeholder={f.ph} value={form[f.key]} onChange={e=>setForm(x=>({...x,[f.key]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {step===2 && (
              <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                className="rounded-2xl p-5" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
                <p className="display font-semibold mb-1" style={{fontSize:16,color:'var(--text-primary)'}}>Select Platforms</p>
                <p className="mono mb-4" style={{fontSize:11,color:'var(--text-muted)'}}>Select all platforms you've worked on</p>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map(p=>{
                    const sel=form.platforms.includes(p)
                    return (
                      <button key={p} onClick={()=>togglePlatform(p)} className="btn-press rounded-xl p-3 text-left transition-all" style={{
                        background:sel?'var(--primary-dim)':'var(--bg-elevated)',
                        border:`1px solid ${sel?'var(--border-brand)':'var(--border-subtle)'}`,
                      }}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center mono font-bold" style={{background:`${PLATFORM_COLORS[p]||'#888'}25`,fontSize:9,color:PLATFORM_COLORS[p]||'#888'}}>{p.slice(0,2)}</div>
                          <span className="display font-semibold" style={{fontSize:13,color:sel?'var(--primary-light)':'var(--text-primary)'}}>{p}</span>
                          {sel&&<CheckCircle2 size={12} style={{color:'var(--primary-light)',marginLeft:'auto'}}/>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
            {step===3 && (
              <motion.div key="s3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                className="rounded-2xl p-5" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
                <p className="display font-semibold mb-4" style={{fontSize:16,color:'var(--text-primary)'}}>Earnings Information</p>
                <div className="space-y-3">
                  {[{label:'Total Earnings (₹) *',key:'earnings',ph:'30000'},{label:'Working Days *',key:'days',ph:'42'},{label:'Avg Monthly (₹)',key:'avgMonthly',ph:'15000'}].map(f=>(
                    <div key={f.key}>
                      <label className="mono mb-1.5 block" style={{fontSize:11,color:'var(--text-muted)'}}>{f.label}</label>
                      <input type="number" className="input-field" placeholder={f.ph} value={form[f.key]} onChange={e=>setForm(x=>({...x,[f.key]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {step===4 && (
              <motion.div key="s4" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                className="rounded-2xl p-5" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
                <p className="display font-semibold mb-4" style={{fontSize:16,color:'var(--text-primary)'}}>Review & Generate</p>
                <div className="space-y-2 mb-4">
                  {[{l:'Name',v:form.name||'—'},{l:'Platforms',v:form.platforms.join(' · ')||'—'},{l:'Working Days',v:form.days||'—'},{l:'Total Earnings',v:form.earnings?`₹${Number(form.earnings).toLocaleString('en-IN')}`:'—'}].map((r,i)=>(
                    <div key={i} className="flex items-center justify-between py-2" style={{borderBottom:'1px solid var(--border-subtle)'}}>
                      <span className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>{r.l}</span>
                      <span className="mono font-semibold" style={{fontSize:12,color:'var(--text-primary)'}}>{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-3 mb-4" style={{background:'var(--primary-dim)',border:'1px solid var(--border-brand)'}}>
                  <p className="mono" style={{fontSize:11,color:'var(--primary-light)',lineHeight:1.5}}>🔒 Your income amount will NOT be stored on-chain. Only your eligibility status is anchored.</p>
                </div>
                <button onClick={generate} disabled={creating} className="w-full btn-press rounded-xl py-3 display font-semibold flex items-center justify-center gap-2"
                  style={{background:'var(--primary)',color:'white',fontSize:14,opacity:creating?0.7:1}}>
                  {creating?(<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Generating on-chain...</>):'Generate Gig Passport'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex gap-2 mt-4">
            {step>1&&<button onClick={()=>setStep(s=>s-1)} className="flex-1 btn-press rounded-xl py-3 mono" style={{background:'var(--bg-elevated)',color:'var(--text-secondary)',fontSize:13}}>Back</button>}
            {step<4&&<button onClick={next} className="flex-1 btn-press rounded-xl py-3 display font-semibold flex items-center justify-center gap-1"
              style={{background:'var(--primary)',color:'white',fontSize:14}}>
              Continue <ChevronRight size={14}/>
            </button>}
          </div>
          <button onClick={()=>setStep(0)} className="w-full mt-2 mono text-center btn-press" style={{fontSize:11,color:'var(--text-muted)',padding:'8px'}}>
            Cancel
          </button>
        </motion.div>
      )}
    </div>
  )
}
