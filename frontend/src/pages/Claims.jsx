import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { FileText, CheckCircle2, Clock, IndianRupee, ExternalLink, Plus, Copy, ChevronDown, AlertTriangle } from 'lucide-react'

const STEPS = [
  { label:'Submitted',       sub:'Claim received', done:true  },
  { label:'Verified On-Chain', sub:'Polygon Amoy', done:true  },
  { label:'Approved',          sub:'In review',      done:false, active:true },
  { label:'Paid',              sub:'~3 min ETA',      done:false },
]

const HISTORY = [
  { id:'CLM-1023', amount:'₹1,200', date:'Mar 10, 2026', status:'paid',  type:'Slump Shield', tx:'0x3f7a…4e1d' },
  { id:'CLM-1019', amount:'₹2,000', date:'Feb 14, 2026', status:'paid',  type:'ESI Benefit',  tx:'0x8c21…9b3a' },
  { id:'CLM-1015', amount:'₹800',   date:'Jan 28, 2026', status:'paid',  type:'Slump Shield', tx:'0x1d45…7f22' },
]

function ConfettiBurst() {
  const colors = ['#14B8A6','#F59E0B','#4ADE80','#818CF8','#F87171','#FBBF24']
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:10}}>
      {Array.from({length:12}).map((_,i)=>(
        <div key={i} className="confetti-particle absolute" style={{
          left:`${20+Math.random()*60}%`,
          top:`${20+Math.random()*40}%`,
          background:colors[i%colors.length],
          animationDelay:`${i*60}ms`,
          animationDuration:`${700+Math.random()*300}ms`,
          transform:`rotate(${Math.random()*360}deg)`,
        }}/>
      ))}
    </div>
  )
}

function ClaimStepper({steps,currentStep}) {
  return (
    <div className="py-2">
      {steps.map((s,i)=>(
        <div key={i} className="relative flex items-start gap-3 pb-5 last:pb-0">
          {/* Connector line */}
          {i<steps.length-1&&(
            <div className="absolute left-[14px] top-7 w-0.5 h-full" style={{background:s.done?'var(--primary)':'var(--border-subtle)',maxHeight:28}}/>
          )}
          {/* Step node */}
          <div className="relative flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{
            background:s.done?'var(--primary)':s.active?'var(--bg-elevated)':'var(--bg-elevated)',
            border:`2px solid ${s.done?'var(--primary)':s.active?'var(--primary-light)':'var(--border-subtle)'}`,
          }}>
            {s.done
              ? <CheckCircle2 size={13} style={{color:'white'}}/>
              : s.active
                ? <motion.div className="w-2 h-2 rounded-full" style={{background:'var(--primary-light)'}}
                    animate={{scale:[1,1.3,1]}} transition={{duration:1.5,repeat:Infinity}}/>
                : <div className="w-2 h-2 rounded-full" style={{background:'var(--border-default)'}}/>
            }
            {s.active&&(
              <motion.div className="absolute inset-[-3px] rounded-full" style={{border:'1px solid var(--primary-light)',opacity:0}}
                animate={{scale:[1,1.5],opacity:[0.5,0]}} transition={{duration:1.5,repeat:Infinity}}/>
            )}
          </div>
          {/* Step content */}
          <div className="flex-1 pt-0.5">
            <div className="flex items-center justify-between">
              <p className="display font-semibold" style={{fontSize:13,color:s.done?'var(--text-primary)':s.active?'var(--primary-light)':'var(--text-muted)'}}>{s.label}</p>
              {s.done&&<span className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>Done</span>}
              {s.active&&<span className="pill pill-brand" style={{fontSize:9}}>In progress</span>}
            </div>
            <p className="mono" style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function SubmitModal({onClose,onSuccess}) {
  const [step,setStep] = useState(1)
  const [form,setForm] = useState({type:'',amount:'',reason:''})
  const [loading,setLoading] = useState(false)

  const TYPES = ['Slump Shield','EPF Claim','ESI Medical','Gratuity','Accident Cover']

  const submit = async () => {
    if(!form.type) return toast.error('Select claim type')
    if(!form.amount) return toast.error('Enter claim amount')
    setLoading(true)
    await new Promise(r=>setTimeout(r,2000))
    setLoading(false)
    onSuccess()
    onClose()
    toast.success('Claim submitted. Processing on Polygon.')
  }

  return (
    <div className="sheet-backdrop" onClick={onClose} style={{display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <motion.div initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} exit={{y:100,opacity:0}}
        transition={{type:'spring',stiffness:400,damping:40}}
        onClick={e=>e.stopPropagation()}
        className="w-full max-w-lg rounded-t-3xl p-5" style={{background:'var(--bg-surface)',border:'1px solid var(--border-subtle)',maxHeight:'85vh',overflowY:'auto'}}>
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{background:'var(--border-strong)'}}/>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'var(--primary-dim)',border:'1px solid var(--border-brand)'}}>
            <FileText size={15} style={{color:'var(--primary-light)'}}/>
          </div>
          <div>
            <p className="display font-bold" style={{fontSize:16,color:'var(--text-primary)'}}>Submit Claim</p>
            <p className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>Takes under 60 seconds</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mono mb-2 block" style={{fontSize:11,color:'var(--text-muted)'}}>Claim Type *</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(t=>(
                <button key={t} onClick={()=>setForm(f=>({...f,type:t}))} className="btn-press rounded-xl p-3 text-left mono" style={{fontSize:12,
                  background:form.type===t?'var(--primary-dim)':'var(--bg-elevated)',
                  border:`1px solid ${form.type===t?'var(--border-brand)':'var(--border-subtle)'}`,
                  color:form.type===t?'var(--primary-light)':'var(--text-secondary)'}}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mono mb-1.5 block" style={{fontSize:11,color:'var(--text-muted)'}}>Amount (₹) *</label>
            <input type="number" className="input-field" placeholder="e.g. 1200" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
          </div>
          <div>
            <label className="mono mb-1.5 block" style={{fontSize:11,color:'var(--text-muted)'}}>Reason (optional)</label>
            <textarea className="input-field" rows={2} placeholder="Brief description of your claim…" value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} style={{resize:'none',height:'auto'}}/>
          </div>
          <div className="rounded-xl p-3" style={{background:'var(--primary-dim)',border:'1px solid var(--border-brand)'}}>
            <p className="mono" style={{fontSize:11,color:'var(--primary-light)',lineHeight:1.5}}>🔒 Your claim is verified against your Gig Passport. No personal income is exposed.</p>
          </div>
          <button onClick={submit} disabled={loading} className="w-full btn-press rounded-xl py-3.5 display font-semibold flex items-center justify-center gap-2"
            style={{background:'var(--primary)',color:'white',fontSize:14,opacity:loading?0.7:1,boxShadow:'0 8px 24px rgba(13,148,136,0.28)'}}>
            {loading?(<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Submitting…</>):'Submit Claim'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Claims() {
  const [activeStep,setActiveStep] = useState(2)
  const [showPaid,setShowPaid] = useState(false)
  const [showSubmit,setShowSubmit] = useState(false)
  const [expandedClaim,setExpandedClaim] = useState(null)
  const [celebrating,setCelebrating] = useState(false)

  const advanceStep = () => {
    if(activeStep<4) {
      setActiveStep(s=>s+1)
      if(activeStep===3) {
        setCelebrating(true)
        setTimeout(()=>setCelebrating(false),2000)
        toast.success('₹1,200 added to your wallet!')
      }
    }
  }

  const stepsWithActive = STEPS.map((s,i)=>({...s,done:i<activeStep-1,active:i===activeStep-1&&activeStep<5}))

  return (
    <div className="page-pad max-w-lg mx-auto">
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} className="mb-5 mt-2">
        <p className="mono mb-1" style={{fontSize:10,color:'var(--text-muted)',letterSpacing:'0.06em',textTransform:'uppercase'}}>Benefits Workflow</p>
        <h1 className="display font-bold" style={{fontSize:'clamp(24px,6vw,32px)',letterSpacing:'-0.03em',color:'var(--text-primary)'}}>
          Your <span style={{color:'var(--primary-light)'}}>Claims</span>
        </h1>
        <p className="mono mt-1" style={{fontSize:12,color:'var(--text-muted)'}}>From submission to payout in minutes, not months</p>
      </motion.div>

      {/* Active claim */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
        className="relative rounded-2xl p-5 mb-3" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
        {celebrating&&<ConfettiBurst/>}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="mono font-semibold" style={{fontSize:12,color:'var(--text-secondary)'}}>Active Claim</p>
            <p className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>CLM-1024 · Slump Shield</p>
          </div>
          <div className="text-right">
            <p className="display font-bold" style={{fontSize:22,color:'var(--primary-light)',letterSpacing:'-0.03em'}}>₹1,200</p>
            <div className="flex items-center gap-1 justify-end">
              <Clock size={10} style={{color:'var(--secondary)'}}/>
              <span className="mono" style={{fontSize:10,color:'var(--secondary)'}}>~3 min ETA</span>
            </div>
          </div>
        </div>
        <ClaimStepper steps={stepsWithActive}/>
        {activeStep<5&&(
          <button onClick={advanceStep} className="w-full btn-press rounded-xl py-2.5 mono mt-3"
            style={{background:'var(--bg-elevated)',border:'1px solid var(--border-default)',fontSize:11,color:'var(--text-secondary)'}}>
            ▶ Advance step (demo)
          </button>
        )}
        {activeStep===5&&(
          <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
            className="mt-3 p-3 rounded-xl" style={{background:'var(--success-bg)',border:'1px solid rgba(74,222,128,0.25)'}}>
            <p className="mono font-semibold" style={{fontSize:12,color:'#4ADE80'}}>✓ ₹1,200 paid to your wallet</p>
            <p className="mono break-word mt-1" style={{fontSize:10,color:'rgba(74,222,128,0.7)'}}>TX: 0x3f7a2b9c4e1d8f22… <a href="#" style={{color:'#4ADE80'}}><ExternalLink size={9} style={{display:'inline'}}/></a></p>
          </motion.div>
        )}
      </motion.div>

      {/* Current stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[{l:'Total Claimed',v:'₹5,200',icon:IndianRupee},{l:'Claims Filed',v:'3',icon:FileText},{l:'Success Rate',v:'100%',icon:CheckCircle2}].map((s,i)=>(
          <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.15+i*0.08}}
            className="rounded-xl p-3 text-center" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
            <s.icon size={15} className="mx-auto mb-1.5" style={{color:'var(--primary-light)'}}/>
            <p className="display font-bold" style={{fontSize:16,color:'var(--text-primary)',letterSpacing:'-0.02em'}}>{s.v}</p>
            <p className="mono" style={{fontSize:9,color:'var(--text-muted)',marginTop:2}}>{s.l}</p>
          </motion.div>
        ))}
      </div>

      {/* Submit new claim */}
      <motion.button initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
        onClick={()=>setShowSubmit(true)}
        className="w-full btn-press rounded-2xl p-4 mb-3 flex items-center gap-3 text-left"
        style={{background:'var(--bg-card)',border:'1px solid var(--border-amber)'}}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'var(--secondary-dim)',border:'1px solid var(--border-amber)'}}>
          <Plus size={18} style={{color:'var(--secondary)'}}/>
        </div>
        <div className="flex-1">
          <p className="display font-semibold" style={{fontSize:14,color:'var(--text-primary)'}}>Submit New Claim</p>
          <p className="mono" style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>You need your Gig Passport · Takes 60 seconds</p>
        </div>
      </motion.button>

      {/* History */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}>
        <button onClick={()=>setShowPaid(p=>!p)} className="w-full flex items-center justify-between p-4 rounded-xl btn-press mb-2"
          style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)'}}>
          <span className="mono font-semibold" style={{fontSize:12,color:'var(--text-secondary)'}}>Claim History (3)</span>
          <ChevronDown size={14} style={{color:'var(--text-muted)',transform:showPaid?'rotate(180deg)':'',transition:'transform 0.2s'}}/>
        </button>
        <AnimatePresence>
          {showPaid&&(
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden space-y-2">
              {HISTORY.map((c,i)=>(
                <div key={i}>
                  <button onClick={()=>setExpandedClaim(expandedClaim===i?null:i)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left card-lift"
                    style={{background:'var(--bg-elevated)',border:'1px solid var(--border-subtle)'}}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'var(--success-bg)',border:'1px solid rgba(74,222,128,0.2)'}}>
                      <CheckCircle2 size={16} style={{color:'#4ADE80'}}/>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <p className="mono font-semibold" style={{fontSize:12,color:'var(--text-primary)'}}>{c.id}</p>
                        <p className="display font-bold" style={{fontSize:14,color:'#4ADE80'}}>{c.amount}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>{c.type}</span>
                        <span className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>·</span>
                        <span className="mono" style={{fontSize:10,color:'var(--text-muted)'}}>{c.date}</span>
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedClaim===i&&(
                      <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                        className="overflow-hidden">
                        <div className="mx-2 mb-2 p-3 rounded-b-xl" style={{background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderTop:'none'}}>
                          <div className="flex items-center gap-2">
                            <span className="mono break-word" style={{fontSize:10,color:'var(--text-muted)'}}>TX: {c.tx}</span>
                            <button onClick={()=>{navigator.clipboard.writeText(c.tx);toast.success('Copied!')}} className="btn-press">
                              <Copy size={10} style={{color:'var(--text-muted)'}}/>
                            </button>
                            <a href="#" className="btn-press"><ExternalLink size={10} style={{color:'var(--primary-light)'}}/></a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showSubmit&&<SubmitModal onClose={()=>setShowSubmit(false)} onSuccess={()=>{}}/>}
      </AnimatePresence>
    </div>
  )
}
