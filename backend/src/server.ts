import 'dotenv/config'
import { env } from './config/env'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import routes from './routes'
import webhookRoutes from './routes/webhook.routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()
const PORT = process.env.PORT ?? 3333

// Segurança
app.use(helmet())
app.use(cors({
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Performance
app.use(compression())

// Logging
app.use(morgan('dev'))

// Webhooks — montados ANTES do express.json() porque precisam de raw body
// e ANTES do rateLimit porque Stripe pode mandar bursts legítimos de eventos
app.use('/api/webhooks', webhookRoutes)

// Rate limit — aplicado só nas rotas da API de negócio
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Muitas requisições, tente novamente mais tarde.' }
}))

// Parse JSON — depois do webhook porque ele precisa de raw body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use('/api', routes)

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

// 404
app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' })
})

// Erro global — sempre por último
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})

export default app