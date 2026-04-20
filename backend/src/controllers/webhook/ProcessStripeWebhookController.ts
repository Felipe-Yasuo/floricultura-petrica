import { Request, Response } from 'express'
import Stripe from 'stripe'
import { stripe } from '../../config/stripe'
import { env } from '../../config/env'
import { ProcessStripeWebhookService } from '../../services/webhook/ProcessStripeWebhookService'

export class ProcessStripeWebhookController {
    private service = new ProcessStripeWebhookService()

    handle = async (req: Request, res: Response): Promise<void> => {
        if (!env.STRIPE_WEBHOOK_SECRET) {
            console.error('[webhook] STRIPE_WEBHOOK_SECRET não configurada')
            res.status(500).json({ error: 'Webhook não configurado' })
            return
        }

        const signature = req.headers['stripe-signature']

        if (!signature || typeof signature !== 'string') {
            res.status(400).json({ error: 'Assinatura ausente' })
            return
        }

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                env.STRIPE_WEBHOOK_SECRET
            )
        } catch (err) {
            const message = err instanceof Error ? err.message : 'erro desconhecido'
            console.error(`[webhook] verificação falhou: ${message}`)
            res.status(400).json({ error: `Webhook Error: ${message}` })
            return
        }

        try {
            await this.service.execute(event)
            res.status(200).json({ received: true })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'erro desconhecido'
            console.error(`[webhook] erro ao processar ${event.type} (${event.id}): ${message}`)
            res.status(500).json({ error: 'Erro ao processar evento' })
        }
    }
}