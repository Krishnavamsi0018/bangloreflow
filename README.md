# GigSecure Chain 🔐

> Portable blockchain identity & social security for India's 23.5M gig workers

## Live Demo

**Vercel:** https://gig-1-frontend.vercel.app

## Tech Stack

| Layer      | Tech                                       |
| ---------- | ------------------------------------------ |
| Frontend   | React 18 + Vite + Tailwind + Framer Motion |
| Backend    | Node.js + Express                          |
| Blockchain | Hardhat + Solidity + Ethers.js v6          |
| AI         | Groq (llama3-70b) via LangChain            |
| Network    | Polygon Amoy Testnet                       |

## Project Structure

```
gigsecure-chain/
├── frontend/          # React + Vite app
│   └── src/
│       ├── pages/     # Dashboard, GigPassport, SlumpShield, Benefits, NFTBadges
│       ├── components/ # Navbar, reusable UI
│       ├── context/   # WalletContext (Ethers.js)
│       └── hooks/     # useContract, usePassport, useSlump
├── backend/           # Express API
│   ├── routes/        # /passport /slump /benefits /zk
│   └── controllers/   # Business logic + Groq AI
└── contracts/         # Solidity smart contracts
    ├── GigPassport.sol # On-chain worker identity
    └── GigNFT.sol     # Soulbound benefit badges (ERC-721)
```

## Quick Start

```bash
# Install all deps
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../contracts && npm install

# Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Terminal 1: Start local blockchain
cd contracts && npx hardhat node

# Terminal 2: Deploy contracts
cd contracts && npm run deploy:local

# Terminal 3: Start backend
cd backend && npm run dev

# Terminal 4: Start frontend
cd frontend && npm run dev
```

## Features

- 🛂 **Gig Passport** — On-chain portable worker identity (SHA-256 + Blockchain)
- ⚡ **Slump Shield** — AI-powered income risk prediction with peer pools
- 🔒 **ZK Benefits** — Zero-knowledge eligibility verification
- 🏆 **NFT Badges** — Soulbound ERC-721 benefit achievement tokens

## India Policy Angle

Built on India's **Code on Social Security 2020** rules (activating 2026).
Targets 23.5M gig workers projected by 2030.
