# BengaluruFlow

Frontend-first hackathon prototype focused on Bengaluru city operations + gig-worker resilience.

This build is optimized for demo speed, mobile usability, and judging clarity.

## Problem

Bengaluru faces uneven demand distribution, route congestion, and income volatility for gig workers.

## Solution

BengaluruFlow provides a mobile-first experience with three core modules:

- SlumpShield: live risk gauge + optimizer simulation for high-demand zones.
- City Dashboard: worker density trends and demand hotspot visibility.
- Gig Passport: portable identity with work history and achievement signals.

## Judging-Focused Design

This repo includes a judge-first presentation flow aligned to typical hackathon criteria:

- Innovation: dynamic risk + zone optimization storytelling.
- Technical Execution: responsive React app, motion-rich UI, and charted analytics.
- Impact & Practicality: grounded in gig-worker daily workflows.
- Presentation & UX: guided demo path and mobile-first interactions.

## Current Architecture

This branch is frontend-only.

- Root workspace: [package.json](package.json)
- App source: [frontend](frontend)
- Backend/contracts folders were intentionally removed in this sprint branch.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- React Router
- React Hot Toast

## Project Structure

```text
gig_1_copilot_sandbox/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```

## Routes

- `/` landing and judge-mode entry
- `/dashboard` quick module launcher
- `/slump-shield` risk and optimizer screen
- `/city` city intelligence dashboard
- `/city-dashboard` alias to city dashboard
- `/passport` gig passport screen
- `/profile` profile/settings

## Quick Start

From repo root:

```bash
npm install
npm run dev
```

Or from frontend directly:

```bash
cd frontend
npm install
npm run dev
```

## Build

From repo root:

```bash
npm run build
npm run preview
```

From frontend directly:

```bash
cd frontend
npm run build
npm run preview
```

## Demo Script (Recommended)

1. Open landing and start Judge Mode.
2. Show SlumpShield slider and route optimization output.
3. Switch to City Dashboard for demand/density insights.
4. End on Gig Passport to show portability and trust artifacts.

## Notes

- This branch prioritizes presentation and usability for hackathon finals.
- Some dependencies remain from earlier iterations; not all are actively used in this sprint.

## License

For hackathon/demo use within this project context.
