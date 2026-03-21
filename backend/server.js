import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

// Routes
import passportRoutes from './routes/passport.js'
import slumpRoutes from './routes/slump.js'
import benefitsRoutes from './routes/benefits.js'
import zkRoutes from './routes/zk.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://gig-1-frontend.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

// Routes
app.use('/api/passport', passportRoutes)
app.use('/api/slump', slumpRoutes)
app.use('/api/benefits', benefitsRoutes)
app.use('/api/zk', zkRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.listen(PORT, () => console.log(`GigSecure API running on port ${PORT}`))
