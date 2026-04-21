import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, Star, Clock, Briefcase, ChevronDown, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { verifyIdentityImage } from '../utils/aiClient';

const PLATFORMS = ['Swiggy', 'Zomato', 'Uber', 'Blinkit', 'Dunzo'];

const BADGES = [
  { label: '42-Day Streak',   color: '#10b981', icon: '🔥' },
  { label: 'Top Earner',      color: '#f59e0b', icon: '⭐' },
  { label: 'Safety Verified', color: '#14b8a6', icon: '🛡️' },
  { label: 'Rain Hero',       color: '#60a5fa', icon: '🌧️' },
];

const HISTORY = [
  { date: 'Apr 19', earned: 1352, orders: 14 },
  { date: 'Apr 18', earned: 980,  orders: 11 },
  { date: 'Apr 17', earned: 1104, orders: 13 },
];

export default function GigPassportSimple() {
  const [expanded, setExpanded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState(null);

  const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const full = String(reader.result || '');
      resolve(full.split(',')[1] || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const onImagePick = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setVerifying(true);
    setVerification(null);

    try {
      const imageBase64 = await readFileAsBase64(file);
      const result = await verifyIdentityImage({ imageBase64, mimeType: file.type || 'image/jpeg' });
      setVerification(result);
      toast.success('Identity verification completed');
    } catch (error) {
      toast.error('Verification failed. Please try another photo.');
    } finally {
      setVerifying(false);
      event.target.value = '';
    }
  };

  return (
    <div className="page-pad max-w-lg mx-auto pb-32">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="display font-bold text-3xl">Gig Passport</h1>
        <p className="mono text-sm text-gray-400">Your portable digital identity</p>
      </motion.div>

      {/* ── Passport Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl overflow-hidden mb-6 relative"
        style={{
          background: 'linear-gradient(135deg, #0d2d26 0%, #0f4a3d 50%, #134e4a 100%)',
          border: '1.5px solid #14b8a6',
          minHeight: 220,
        }}
      >
        {/* Watermark */}
        <div className="absolute inset-0 opacity-5 flex items-center justify-center">
          <Shield size={180} />
        </div>

        <div className="relative p-6">
          {/* Top row */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <Shield size={28} className="text-teal-400" />
              <div>
                <p className="text-xs mono text-teal-400 leading-none">GIGSECURE CHAIN</p>
                <p className="text-xs text-gray-400">Bengaluru • India</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 bg-emerald-900/60 text-emerald-300 text-xs px-3 py-1.5 rounded-full font-semibold">
              <CheckCircle2 size={12} /> Verified
            </span>
          </div>

          {/* Passport ID */}
          <p className="text-4xl font-black tracking-tight text-white mb-1">RK-2026-001</p>
          <p className="text-xl text-gray-300 font-semibold">Ravi Kumar</p>

          {/* Stats row */}
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-2xl font-black text-teal-400">42</p>
              <p className="text-xs text-gray-400">Days verified</p>
            </div>
            <div>
              <p className="text-2xl font-black text-yellow-400">4.9⭐</p>
              <p className="text-xs text-gray-400">Rating</p>
            </div>
            <div>
              <p className="text-2xl font-black text-purple-400">₹82k</p>
              <p className="text-xs text-gray-400">Lifetime earned</p>
            </div>
          </div>

          {/* Platform chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            {PLATFORMS.map(p => (
              <span key={p} className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                {p}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── NFT Badges ── */}
      <p className="text-xs mono text-gray-500 mb-3">SOULBOUND BADGES</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {BADGES.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: '#111827', border: `1px solid ${b.color}30` }}
          >
            <span className="text-2xl">{b.icon}</span>
            <span className="text-sm font-semibold" style={{ color: b.color }}>{b.label}</span>
          </motion.div>
        ))}
      </div>

      {/* ── AI Verify Identity ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="rounded-3xl p-5 mb-6"
        style={{ background: '#111827', border: '1px solid #1f2937' }}
      >
        <p className="text-sm font-semibold text-teal-400 mb-1">AI Passport Verifier</p>
        <p className="text-xs text-gray-400 mb-3">Upload a selfie to generate trust signals + verification hash.</p>

        <label
          htmlFor="passport-verify"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold cursor-pointer"
        >
          <Camera size={15} /> Verify Identity
        </label>
        <input
          id="passport-verify"
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={onImagePick}
        />

        {verifying && (
          <div className="flex items-center gap-2 text-sm text-gray-300 mt-3">
            <Loader2 size={16} className="animate-spin" />
            Running trust analysis...
          </div>
        )}

        {verification && (
          <div className="mt-4 rounded-2xl p-4" style={{ background: '#0b1220', border: '1px solid #1f2937' }}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-emerald-400">Verification Card</p>
              <span className="text-xs text-gray-400 uppercase">{verification.source}</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">Confidence: <span className="text-gray-100">{verification.confidence}%</span></p>
            <p className="text-xs text-gray-400 mb-2">Trust score: <span className="text-gray-100">{verification.trustScore}/100</span></p>
            <p className="text-xs text-gray-300 leading-relaxed mb-2">{verification.summary}</p>
            <ul className="text-xs text-gray-400 space-y-1 mb-2">
              {(verification.signals || []).map((signal) => (
                <li key={signal}>• {signal}</li>
              ))}
            </ul>
            <p className="text-[10px] mono text-teal-300 break-all">{verification.hash}</p>
          </div>
        )}
      </motion.div>

      {/* ── Work History ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl overflow-hidden mb-6"
        style={{ background: '#111827' }}
      >
        <button
          className="w-full flex justify-between items-center p-5"
          onClick={() => setExpanded(v => !v)}
        >
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-teal-400" />
            <span className="font-semibold">Recent Work History</span>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-gray-400" />
          </motion.div>
        </button>

        {expanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5">
            {HISTORY.map((h, i) => (
              <div key={h.date} className={`flex justify-between items-center py-3 ${i < HISTORY.length - 1 ? 'border-b border-gray-800' : ''}`}>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-300">{h.date}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-teal-400">₹{h.earned}</p>
                  <p className="text-xs text-gray-500">{h.orders} orders</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* ── Footer ── */}
      <p className="text-center mono text-xs text-gray-500">
        Portable • Privacy-first • Accepted by BBMP &amp; benefit schemes
      </p>
    </div>
  );
}
