# BengaluruFlow — Enhanced Frontend v2.0

**Hackathon-ready. Mobile-first. Judge-winning.**

## Quick Start

```bash
npm install
npm run dev       # http://localhost:5173
```

## Production Build (already done → dist/)

```bash
npm run build
npm run preview   # preview the built app
```

## App Routes

| Route             | Screen                      | Priority |
| ----------------- | --------------------------- | -------- |
| `/`               | Landing page                | P0       |
| `/dashboard`      | Home (open this for demo)   | P0       |
| `/city`           | City Intelligence dashboard | P0       |
| `/city-dashboard` | City dashboard alias        | P0       |
| `/passport`       | Gig Passport + AI verifier  | P0       |
| `/slump-shield`   | AI SlumpShield optimizer    | P0       |
| `/profile`        | Settings + language         | P1       |

## Demo Script (3 minutes)

1. **0:00–0:25** — Open `/city`. Ask: "What will Bengaluru demand look like at 8pm?" Show live streamed AI forecast + Kannada voice.
2. **0:25–1:20** — Open `/slump-shield`. Move risk slider and tap "Explain this risk score →" to stream actionable AI explanation.
3. **1:20–2:10** — In SlumpShield, ask "Where should I go right now?" using text or mic and trigger optimizer modal.
4. **2:10–2:45** — Open `/passport`. Tap "Verify Identity" and show trust verification card with confidence, signals, and hash.
5. **2:45–3:00** — Open `/profile`, switch language to Kannada, return to `/city`, and show translated labels.

## Design System

- **Primary**: Teal `#0D9488` — trust, safety
- **Secondary**: Amber `#F59E0B` — attention, money
- **Font**: Sora (display) + DM Sans (body) + JetBrains Mono (data)
- **Mobile baseline**: 360×800px
- All tokens in `src/index.css` `:root` block

## Key Features Built

- ✅ Animated protection ring gauge (SVG, spring physics)
- ✅ Semi-circular income risk gauge with needle sweep
- ✅ Earnings area chart with slump-day red dots
- ✅ Live Groq AI streaming for SlumpShield advisor + risk explainer
- ✅ Live Groq AI city operator forecast console
- ✅ Kannada voice output for AI responses
- ✅ Voice input via Web Speech API (mic)
- ✅ Formula-based optimizer recommendations (risk + zone + weather + time)
- ✅ AI passport verifier card with selfie upload flow
- ✅ Animated gradient border passport card
- ✅ Framer Motion page transitions
- ✅ Bottom nav with spring-physics active indicator
- ✅ Toast notifications via react-hot-toast
- ✅ Glass morphism nav + safe area inset
- ✅ Language switcher wired to live UI labels (including Kannada city labels)
- ✅ Typewriter-like streaming AI card updates
- ✅ Mobile-first, 360px baseline tested

## Environment Variables

Use Vercel project environment variables for server-side AI keys:

```bash
GROQ_API_KEY=your_groq_api_key
CLAUDE_API_KEY=your_claude_api_key
```

- `GROQ_API_KEY` is required for `/api/chat`.
- `CLAUDE_API_KEY` is optional for `/api/vision-verify`; fallback mode works without it.

## Stack

React 18 · Vite · Tailwind CSS · Framer Motion · Recharts · Lucide Icons · react-hot-toast
