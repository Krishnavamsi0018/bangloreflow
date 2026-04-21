import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Zap, TrendingUp, Clock, AlertTriangle, Mic, Send, Volume2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import toast from 'react-hot-toast';
import { streamGroqChat } from '../utils/aiClient';
import { useLanguage } from '../context/LanguageContext';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const HOTSPOTS = [
  { area: 'Koramangala',    density: 92, orders: '3.2x', color: '#10b981', congestion: 'Low',    workers: 1247 },
  { area: 'Whitefield',     density: 78, orders: '2.8x', color: '#eab308', congestion: 'Medium', workers: 985  },
  { area: 'Electronic City',density: 65, orders: '1.9x', color: '#8b5cf6', congestion: 'Medium', workers: 712  },
  { area: 'Yelahanka',      density: 45, orders: '0.8x', color: '#ef4444', congestion: 'High',   workers: 423  },
  { area: 'Indiranagar',    density: 88, orders: '2.5x', color: '#06b6d4', congestion: 'Low',    workers: 1102 },
  { area: 'JP Nagar',       density: 55, orders: '1.4x', color: '#f97316', congestion: 'Medium', workers: 634  },
];

const HOURLY = [
  { h: '6am', w: 312 }, { h: '8am', w: 890 }, { h: '10am', w: 1240 },
  { h: '12pm', w: 1890 }, { h: '2pm', w: 1450 }, { h: '4pm', w: 1680 },
  { h: '6pm', w: 2100 }, { h: '8pm', w: 1760 }, { h: '10pm', w: 890 },
];

const STATS = [
  { label: 'Active Workers',  value: '6,103', icon: Users,       color: '#14b8a6' },
  { label: 'Avg Earnings',    value: '₹924',  icon: TrendingUp,  color: '#f59e0b' },
  { label: 'Peak Hour',       value: '6–8 PM',icon: Clock,       color: '#8b5cf6' },
  { label: 'High-Risk Zones', value: '2',     icon: AlertTriangle,color: '#ef4444' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 10, padding: '6px 12px' }}>
      <p style={{ color: '#9ca3af', fontSize: 10, marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#14b8a6', fontWeight: 700, fontSize: 14 }}>{payload[0].value} workers</p>
    </div>
  );
};

// ─── Main ────────────────────────────────────────────────────────────────────
export default function CityDashboard() {
  const [live, setLive] = useState(6103);
  const [question, setQuestion] = useState('What will Bengaluru demand look like at 8pm?');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const { language } = useLanguage();

  const labelMap = {
    English: {
      zoneBreakdown: 'ZONE BREAKDOWN',
      workersByHour: 'WORKER DENSITY BY HOUR (TODAY)',
      lowTraffic: 'Low traffic',
      mediumTraffic: 'Medium traffic',
      highTraffic: 'High traffic',
      forecastTitle: 'AI City Demand Forecast',
      forecastHint: 'Ask like a BBMP operator: "Where should we redirect workers at 8pm?"',
    },
    Kannada: {
      zoneBreakdown: 'ವಲಯ ವಿಶ್ಲೇಷಣೆ',
      workersByHour: 'ಗಂಟೆವಾರು ಕಾರ್ಯಕರ್ತರ ಸಾಂದ್ರತೆ (ಇಂದು)',
      lowTraffic: 'ಕಡಿಮೆ ಟ್ರಾಫಿಕ್',
      mediumTraffic: 'ಮಧ್ಯಮ ಟ್ರಾಫಿಕ್',
      highTraffic: 'ಹೆಚ್ಚು ಟ್ರಾಫಿಕ್',
      forecastTitle: 'AI ನಗರ ಬೇಡಿಕೆ ಪೂರ್ವಾನುಮಾನ',
      forecastHint: 'BBMP ಆಪರೇಟರ್ ಪ್ರಶ್ನೆ: "8pm ಸಮಯಕ್ಕೆ ಯಾರನ್ನು ಎಲ್ಲಿ ಕಳುಹಿಸಬೇಕು?"',
    },
  };

  const copy = labelMap[language] || labelMap.English;
  const zoneNameMap = {
    Kannada: {
      Koramangala: 'ಕೊರಮಂಗಲ',
      Whitefield: 'ವೈಟ್‌ಫೀಲ್ಡ್',
      'Electronic City': 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ',
      Yelahanka: 'ಯೆಲಹಂಕ',
      Indiranagar: 'ಇಂದಿರಾನಗರ',
      'JP Nagar': 'ಜೆಪಿ ನಗರ',
    },
  };

  const speakKannada = (text) => {
    try {
      if (!window.speechSynthesis) return;
      const kannadaLine = text.match(/Kannada\s*:\s*(.+)/i)?.[1] || 'ಈಗ ಬೇಡಿಕೆ ಹೆಚ್ಚು ಇರುವ ವಲಯಕ್ಕೆ ಕಾರ್ಯಕರ್ತರನ್ನು ಮಾರ್ಗದರ್ಶಿಸಿ';
      const utterance = new SpeechSynthesisUtterance(kannadaLine.trim());
      utterance.lang = 'kn-IN';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      // Voice output is best effort.
    }
  };

  const askDemandForecast = async (q) => {
    if (!q.trim()) return;

    setLoading(true);
    setAnswer('');

    const zoneContext = HOTSPOTS
      .map((spot) => `${spot.area}: density ${spot.density}, orders ${spot.orders}, traffic ${spot.congestion}, workers ${spot.workers}`)
      .join('\n');

    const hourlyContext = HOURLY.map((h) => `${h.h}: ${h.w}`).join(', ');

    const prompt = [
      `Operator query: ${q}`,
      'Persona: BBMP city operations control room',
      `Language preference: ${language}`,
      'Zone data:',
      zoneContext,
      `Hourly trend: ${hourlyContext}`,
      'Provide 3 tactical actions and mention 2 zones to prioritize. End with one Kannada sentence prefixed exactly as "Kannada:".',
    ].join('\n');

    try {
      const full = await streamGroqChat({
        prompt,
        system: 'You are BengaluruFlow City Operator AI. Give practical zone-routing recommendations for Bengaluru municipal operations.',
        onToken: (partial) => setAnswer(partial),
      });
      setAnswer(full);
      speakKannada(full);
    } catch (error) {
      setAnswer('Forecast AI is unavailable right now. Please retry in a moment.');
      toast.error('City AI forecast failed');
    } finally {
      setLoading(false);
    }
  };

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
      setQuestion(spoken);
      askDemandForecast(spoken);
    };

    recognition.onerror = () => toast.error('Could not capture voice input');
    recognition.onend = () => setListening(false);
  };

  // Simulate live counter drift
  useEffect(() => {
    const t = setInterval(() => {
      setLive(v => v + Math.floor(Math.random() * 6) - 2);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="page-pad max-w-lg mx-auto pb-32">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="display font-bold text-3xl">BBMP GigFlow Dashboard</h1>
        <p className="mono text-sm text-gray-400">Live gig-worker density + high-order zones • Bengaluru</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 mono">LIVE — {live.toLocaleString()} workers active</span>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-4"
            style={{ background: '#111827' }}
          >
            <s.icon size={18} style={{ color: s.color }} className="mb-2" />
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Hourly Worker Chart ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="rounded-3xl p-5 mb-6"
        style={{ background: '#111827' }}
      >
        <p className="text-xs mono text-gray-500 mb-4">{copy.workersByHour}</p>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={HOURLY} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="h" tick={{ fill: '#6b7280', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="w" radius={[6, 6, 0, 0]}>
              {HOURLY.map((_, i) => (
                <Cell key={i} fill={i === 6 ? '#14b8a6' : '#1f2937'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-teal-400 mono text-center mt-2">▲ Peak: 6 PM — 2,100 active workers</p>
      </motion.div>

      {/* ── AI Operator Console ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="rounded-3xl p-5 mb-6"
        style={{ background: '#111827', border: '1px solid #1f2937' }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-teal-400">{copy.forecastTitle}</p>
          <Volume2 size={16} className="text-teal-400" />
        </div>
        <p className="text-xs text-gray-400 mb-3">{copy.forecastHint}</p>

        <div className="flex gap-2 mb-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 bg-gray-900 text-sm text-gray-200 rounded-xl px-3 py-2 border border-gray-700 outline-none"
            placeholder="What zones should we prioritize right now?"
          />
          <button
            onClick={startVoiceInput}
            className={`rounded-xl px-3 border ${listening ? 'bg-red-900/40 border-red-500 text-red-300' : 'bg-gray-900 border-gray-700 text-gray-300'}`}
            title="Speak your operator query"
          >
            <Mic size={16} />
          </button>
          <button
            onClick={() => askDemandForecast(question)}
            className="rounded-xl px-3 bg-teal-600 text-white"
            title="Run forecast"
          >
            <Send size={16} />
          </button>
        </div>

        {loading && !answer && (
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-teal-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.8 }}
              />
            ))}
          </div>
        )}

        {!!answer && (
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{answer}</p>
        )}
      </motion.div>

      {/* ── Zone Grid ── */}
      <p className="text-xs mono text-gray-500 mb-3">{copy.zoneBreakdown}</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {HOTSPOTS.map((spot, i) => (
          <motion.div
            key={spot.area}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            className="rounded-3xl p-5"
            style={{ background: '#111827', border: `1.5px solid ${spot.color}28` }}
          >
            <div className="flex justify-between items-start mb-3">
              <p className="font-bold text-sm leading-tight">{spot.area}</p>
              <MapPin size={16} style={{ color: spot.color }} />
            </div>
            {language === 'Kannada' && (
              <p className="text-[11px] text-gray-500 -mt-2 mb-2">{zoneNameMap.Kannada[spot.area]}</p>
            )}

            {/* Density bar */}
            <div className="h-1.5 bg-gray-800 rounded-full mb-3">
              <motion.div
                className="h-1.5 rounded-full"
                style={{ background: spot.color }}
                initial={{ width: 0 }}
                animate={{ width: `${spot.density}%` }}
                transition={{ delay: 0.4 + i * 0.07, duration: 0.7, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-black" style={{ color: spot.color }}>{spot.density}</span>
              <span className="text-xs text-gray-500 mb-1">workers/km²</span>
            </div>

            <div className="flex justify-between text-xs mt-2">
              <span className="flex items-center gap-1 text-gray-300">
                <Zap size={11} /> {spot.orders}
              </span>
              <span className={`text-xs font-medium ${
                spot.congestion === 'Low' ? 'text-emerald-400'
                : spot.congestion === 'Medium' ? 'text-yellow-400'
                : 'text-red-400'
              }`}>
                {spot.congestion === 'Low'
                  ? copy.lowTraffic
                  : spot.congestion === 'Medium'
                    ? copy.mediumTraffic
                    : copy.highTraffic}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Impact Footer ── */}
      <div className="rounded-3xl p-5 text-center"
        style={{ background: 'linear-gradient(135deg, #0d2d26, #111827)', border: '1px solid #14b8a6' }}>
        <p className="text-teal-400 font-bold text-lg">Reduces congestion by 31%</p>
        <p className="text-xs text-gray-400 mt-1 mono">
          Covers 2.3M workers across 6 Bengaluru zones
        </p>
      </div>
    </div>
  );
}
