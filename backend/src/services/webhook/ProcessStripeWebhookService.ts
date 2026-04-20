import Stripe from 'stripe'
import prismaClient from '../../lib/prisma'
import { HandlePaymentSucceededService } from './HandlePaymentSucceededService'
import { HandlePaymentFailedService } from './HandlePaymentFailedService'

export class ProcessStripeWebhookService {
    private handlePaymentSucceeded = new HandlePaymentSucceededService()
    private handlePaymentFailed = new HandlePaymentFailedService()

    async execute(event: Stripe.Event): Promise<void> {
        const existing = await prismaClient.processedStripeEvent.findUnique({
            where: { eventId: event.id }
        })

        if (existing) {
            console.log(`[webhook] evento ${event.id} (${event.type}) já processado, ignorando`)
            return
        }

        console.log(`[webhook] processando ${event.type} (${event.id})`)

        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentSucceeded.execute(event.data.object)
                break

            case 'payment_intent.payment_failed':
                await this.handlePaymentFailed.execute(event.data.object)
                break

            default:
                console.log(`[webhook] evento ${event.type} ignorado (não tratado)`)
                break
        }

        await prismaClient.processedStripeEvent.create({
            data: {
                eventId: event.id,
                type: event.type,
            }
        })
    }
}