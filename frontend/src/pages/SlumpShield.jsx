import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Zap, Brain, TrendingDown, ArrowRight,
  MapPin, IndianRupee, Volume2, CloudRain, X, Mic, Send
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { streamGroqChat } from '../utils/aiClient';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const EARNINGS_DATA = [
  { day: 'Mar 1',  e: 902  },
  { day: 'Mar 5',  e: 871  },
  { day: 'Mar 10', e: 1014 },
  { day: 'Mar 15', e: 899  },
  { day: 'Mar 19', e: 463  },
  { day: 'Mar 23', e: 201  },
  { day: 'Mar 27', e: 1559 },
  { day: 'Mar 30', e: 1352 },
];

const BENGALURU_ZONES = [
  { name: 'Koramangala', traffic: 'Low', orders: 'Very High', baseDemand: 94, travelFriction: 28 },
  { name: 'Whitefield', traffic: 'Medium', orders: 'High', baseDemand: 80, travelFriction: 42 },
  { name: 'Yelahanka', traffic: 'High', orders: 'Low', baseDemand: 46, travelFriction: 65 },
  { name: 'Electronic City', traffic: 'Medium', orders: 'High', baseDemand: 72, travelFriction: 51 },
];

const RISK_COLOR = (score) => {
  if (score < 35) return '#10b981'; // green
  if (score < 65) return '#f59e0b'; // amber
  return '#ef4444';                 // red
};

const RISK_LABEL = (score) => {
  if (score < 35) return 'Low Risk';
  if (score < 65) return 'Moderate Risk';
  return 'High Risk';
};

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: '8px 14px' }}>
      <p style={{ color: '#9ca3af', fontSize: 11, marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#14b8a6', fontWeight: 700, fontSize: 16 }}>₹{payload[0].value}</p>
    </div>
  );
};

// ─── Risk Gauge (SVG arc) ────────────────────────────────────────────────────
function RiskGauge({ score }) {
  const color = RISK_COLOR(score);
  const label = RISK_LABEL(score);
  const r = 80;
  const cx = 110, cy = 110;
  const startAngle = 200; // degrees
  const endAngle   = -20;
  const totalArc   = startAngle - endAngle; // 220°
  const fillAngle  = startAngle - (totalArc * score / 100);

  const polar = (deg) => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy - r * Math.sin((deg * Math.PI) / 180),
  });

  const arcPath = (from, to, radius) => {
    const s = polar(from);
    const e = polar(to);
    const largeArc = Math.abs(from - to) > 180 ? 1 : 0;
    const sweep = from > to ? 0 : 1;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${e.x} ${e.y}`;
  };

  const needle = polar(fillAngle);

  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="140" viewBox="0 0 220 140">
        {/* Track */}
        <path
          d={arcPath(startAngle, endAngle, r)}
          stroke="#1f2937"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={arcPath(startAngle, fillAngle, r)}
          stroke={color}
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />
        {/* Needle dot */}
        <circle cx={needle.x} cy={needle.y} r={8} fill={color} />
        {/* Score */}
        <text x={cx} y={cy + 8} textAnchor="middle" fill="white" fontSize="36" fontWeight="800">{score}</text>
        <text x={cx} y={cy + 26} textAnchor="middle" fill="#6b7280" fontSize="11">Risk Score</text>
        {/* Label badges */}
        <text x="30"  y="134" textAnchor="middle" fill="#10b981" fontSize="9">LOW</text>
        <text x="110" y="140" textAnchor="middle" fill="#f59e0b" fontSize="9">MED</text>
        <text x="190" y="134" textAnchor="middle" fill="#ef4444" fontSize="9">HIGH</text>
      </svg>
      <motion.span
        key={label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-semibold mt-1"
        style={{ color }}
      >
        {label}
      </motion.span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SlumpShield() {
  const [riskScore, setRiskScore] = useState(68);
  const [currentZone, setCurrentZone] = useState(BENGALURU_ZONES[1].name);
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAI, setLoadingAI] = useState(true);
  const [aiQuestion, setAiQuestion] = useState('Where should I go right now in Bengaluru?');
  const [listening, setListening] = useState(false);
  const [optimizerOpen, setOptimizerOpen] = useState(false);
  const [bestRoute, setBestRoute] = useState(null);
  const [weather] = useState('Light Rain');
  const activeAiRequest = useRef(null);

  const hour = new Date().getHours();
  const peakWindow = hour >= 17 && hour <= 21;

  const rankedZones = useMemo(() => {
    return BENGALURU_ZONES.map((zone, idx) => {
      const currentIdx = BENGALURU_ZONES.findIndex((item) => item.name === currentZone);
      const relocationPenalty = Math.abs(currentIdx - idx) * 7;
      const rainPenalty = weather.includes('Rain') ? zone.travelFriction * 0.18 : zone.travelFriction * 0.08;
      const riskPenalty = riskScore * (zone.traffic === 'High' ? 0.55 : zone.traffic === 'Medium' ? 0.35 : 0.2);
      const peakBonus = peakWindow ? zone.baseDemand * 0.15 : 0;

      const score = Math.max(8, zone.baseDemand + peakBonus - rainPenalty - riskPenalty - relocationPenalty);
      const expectedProfit = Math.round(420 + score * 9.2 + (peakWindow ? 110 : 0));
      const timeSave = Math.max(8, Math.round((zone.baseDemand - zone.travelFriction / 2) / 2));

      return {
        ...zone,
        score,
        expectedProfit,
        timeSave,
      };
    }).sort((a, b) => b.score - a.score);
  }, [currentZone, peakWindow, riskScore, weather]);

  const topRoute = rankedZones[0];

  const speakKannada = (text) => {
    try {
      if (!window.speechSynthesis) return;
      const kannadaLine = text.match(/Kannada\s*:\s*(.+)/i)?.[1] || 'ಇದೀಗ ಹೆಚ್ಚು ಬೇಡಿಕೆಯ ವಲಯಕ್ಕೆ ಹೋಗಿ';
      const utterance = new SpeechSynthesisUtterance(kannadaLine.trim());
      utterance.lang = 'kn-IN';
      utterance.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      // Voice output is best effort.
    }
  };

  const askAI = async ({ question, mode }) => {
    if (!question.trim()) return;

    if (activeAiRequest.current) {
      activeAiRequest.current.abort();
    }

    const controller = new AbortController();
    activeAiRequest.current = controller;

    setLoadingAI(true);
    setAiAdvice('');

    const zoneContext = rankedZones
      .map((z) => `${z.name}: score ${Math.round(z.score)}, est-profit ₹${z.expectedProfit}, traffic ${z.traffic}, orders ${z.orders}`)
      .join('\n');

    const prompt = [
      `Worker question: ${question}`,
      `Mode: ${mode}`,
      `Current zone: ${currentZone}`,
      `Weather: ${weather}`,
      `Time bucket: ${peakWindow ? 'Peak evening demand' : 'Non-peak window'}`,
      `Risk score: ${riskScore}/100 (${RISK_LABEL(riskScore)})`,
      'Zone context:',
      zoneContext,
      'Return practical advice with 3 short action bullets. End with one Kannada sentence prefixed exactly as "Kannada:".',
    ].join('\n');

    try {
      const full = await streamGroqChat({
        prompt,
        signal: controller.signal,
        system:
          'You are BengaluruFlow SlumpShield AI advisor. Be concise, grounded in inputs, and avoid generic tips.',
        onToken: (partial) => setAiAdvice(partial),
      });
      setAiAdvice(full);
      speakKannada(full);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setAiAdvice('AI is temporarily unavailable. Try again in a few seconds.');
        toast.error('Unable to load AI guidance');
      }
    } finally {
      setLoadingAI(false);
    }
  };

  // Load live AI advice on screen open.
  useEffect(() => {
    askAI({ question: aiQuestion, mode: 'zone-advisor' });

    return () => {
      if (activeAiRequest.current) {
        activeAiRequest.current.abort();
      }
    };
  }, []);

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const spoken = event.results?.[0]?.[0]?.transcript || '';
      setAiQuestion(spoken);
      askAI({ question: spoken, mode: 'zone-advisor' });
    };

    recognition.onerror = () => {
      toast.error('Could not capture voice, please try again');
    };

    recognition.onend = () => setListening(false);
  };

  const runOptimizer = () => {
    setBestRoute(topRoute);
    setOptimizerOpen(true);

    speakKannada(`Kannada: ಹೆಚ್ಚು ಆದಾಯಕ್ಕಾಗಿ ${topRoute.name} ಕಡೆ ಹೋಗಿ`);

    toast.success('🚀 Optimized route ready!');
  };

  const color = RISK_COLOR(riskScore);

  return (
    <div className="page-pad max-w-lg mx-auto pb-32">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="display font-bold text-3xl">Slump Shield</h1>
        <p className="mono text-sm text-gray-400">GigFlow Optimizer • Bengaluru</p>
      </motion.div>

      {/* ── Risk Gauge ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-6 mb-4"
        style={{ background: '#111827' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs mono text-gray-500">INCOME RISK SCORE</span>
          <span className="flex items-center gap-1 text-xs text-blue-400">
            <CloudRain size={12} /> {weather}
          </span>
        </div>
        <RiskGauge score={riskScore} />

        <button
          onClick={() => askAI({ question: 'Explain why my risk score is high and how to reduce it.', mode: 'risk-explainer' })}
          className="w-full mt-2 mb-3 text-left text-xs text-teal-300 underline underline-offset-4"
        >
          Explain this risk score →
        </button>

        {/* Risk slider (demo mode for judges) */}
        <div className="mt-4">
          <input
            type="range"
            min={0} max={100}
            value={riskScore}
            onChange={e => setRiskScore(Number(e.target.value))}
            className="w-full accent-teal-500"
          />
          <p className="text-center text-xs text-gray-500 mt-1">Demo: drag to adjust risk</p>
        </div>
      </motion.div>

      {/* ── AI Insight ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-5 mb-4"
        style={{ background: '#111827', border: '1px solid #1f2937' }}
      >
        <div className="flex items-start gap-3 mb-3">
          <Brain size={20} className="text-teal-400 mt-0.5 shrink-0" />
          {loadingAI ? (
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-2 h-2 rounded-full bg-teal-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.8 }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{aiAdvice}</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Ask AI: Where should I work right now?"
            className="flex-1 bg-gray-900 text-sm text-gray-200 rounded-xl px-3 py-2 border border-gray-700 outline-none"
          />
          <button
            onClick={startVoiceInput}
            className={`rounded-xl px-3 border ${listening ? 'bg-red-900/40 border-red-500 text-red-300' : 'bg-gray-900 border-gray-700 text-gray-300'}`}
            title="Speak your question"
          >
            <Mic size={16} />
          </button>
          <button
            onClick={() => askAI({ question: aiQuestion, mode: 'zone-advisor' })}
            className="rounded-xl px-3 bg-teal-600 text-white"
            title="Ask advisor"
          >
            <Send size={16} />
          </button>
        </div>
      </motion.div>

      {/* ── Earnings Chart ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl p-5 mb-6"
        style={{ background: '#111827' }}
      >
        <p className="text-xs mono text-gray-500 mb-4">EARNINGS THIS MONTH (₹)</p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={EARNINGS_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="e"
              stroke="#14b8a6" strokeWidth={2.5}
              fill="url(#earningsGrad)"
              dot={{ fill: '#14b8a6', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Zone Cards ── */}
      <p className="text-xs mono text-gray-500 mb-3">BENGALURU DEMAND ZONES</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {rankedZones.map((z, i) => (
          <motion.div
            key={z.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.06 }}
            className="rounded-2xl p-4 cursor-pointer"
            onClick={() => setCurrentZone(z.name)}
            style={{
              background: '#111827',
              border:
                z.name === currentZone ? '1.5px solid #14b8a6' : i === 0 ? '1.5px solid #10b981' : '1px solid #1f2937',
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-sm">{z.name}</p>
              {i === 0 && <span className="text-xs bg-emerald-900/60 text-emerald-400 px-1.5 py-0.5 rounded-full">Best</span>}
            </div>
            <p className="text-xl font-bold text-teal-400">₹{z.expectedProfit}</p>
            <p className="text-xs text-gray-400 mt-1">Traffic: {z.traffic}</p>
            <p className="text-xs text-gray-400">{z.orders} orders</p>
          </motion.div>
        ))}
      </div>

      {/* ── Optimize CTA ── */}
      {riskScore > 45 && (
        <motion.button
          onClick={runOptimizer}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="w-full rounded-3xl p-5 flex items-center gap-4 text-black font-bold text-lg shadow-lg"
          style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
        >
          <ArrowRight size={28} />
          <div className="flex-1 text-left">
            Optimize My Day
            <br />
            <span className="text-sm font-normal opacity-80">More profit • Less traffic • High orders</span>
          </div>
          <IndianRupee size={28} />
        </motion.button>
      )}

      {riskScore <= 45 && (
        <div className="w-full rounded-3xl p-5 text-center"
          style={{ background: '#111827', border: '1.5px solid #10b981' }}>
          <p className="text-emerald-400 font-semibold">✅ You're on a good streak!</p>
          <p className="text-xs text-gray-400 mt-1">Risk is low — keep your current zone.</p>
        </div>
      )}

      {/* ── Optimizer Modal ── */}
      <AnimatePresence>
        {optimizerOpen && bestRoute && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOptimizerOpen(false)}
          >
            <motion.div
              className="bg-white text-black w-full rounded-t-3xl p-6"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close pill */}
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Best Route for You</h2>
                  <p className="text-emerald-600 text-lg font-semibold">{bestRoute.name}</p>
                </div>
                <button onClick={() => setOptimizerOpen(false)}>
                  <X size={22} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 my-8 text-center">
                <div>
                  <IndianRupee className="mx-auto mb-1 text-emerald-600" size={28} />
                  <p className="text-4xl font-black">+₹{bestRoute.expectedProfit}</p>
                  <p className="text-xs text-gray-500 mt-1">Extra profit today</p>
                </div>
                <div>
                  <MapPin className="mx-auto mb-1 text-blue-500" size={28} />
                  <p className="text-4xl font-black">{bestRoute.timeSave}m</p>
                  <p className="text-xs text-gray-500 mt-1">Traffic avoided</p>
                </div>
                <div>
                  <Zap className="mx-auto mb-1 text-orange-500" size={28} />
                  <p className="text-4xl font-black">3×</p>
                  <p className="text-xs text-gray-500 mt-1">Orders right now</p>
                </div>
              </div>

              {/* Zone comparison */}
              <div className="rounded-2xl bg-gray-50 p-4 mb-6">
                <p className="text-xs text-gray-500 font-semibold mb-3">ALL ZONES TODAY</p>
                {BENGALURU_ZONES.map((z, i) => (
                  <div key={z.name} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full"
                        style={{ background: i === 0 ? '#10b981' : i === 1 ? '#eab308' : i === 2 ? '#ef4444' : '#8b5cf6' }} />
                      <span className="text-sm font-medium">{z.name}</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-700">₹{rankedZones.find((r) => r.name === z.name)?.expectedProfit || 0}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setOptimizerOpen(false); toast.success('Route saved! Safe delivery 🛵'); }}
                className="w-full py-4 bg-black text-white rounded-3xl font-bold flex items-center justify-center gap-3 text-base"
              >
                <Volume2 size={20} /> Start Navigation + Kannada Alert
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-gray-500 mt-5 mono">
        Reduces congestion 31% • Average worker gain ₹340/day
      </p>
    </div>
  );
}
