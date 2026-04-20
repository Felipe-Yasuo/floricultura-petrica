import Stripe from 'stripe'
import prismaClient from '../../lib/prisma'

export class HandlePaymentSucceededService {
    async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const payment = await prismaClient.payment.findUnique({
            where: { stripePaymentIntentId: paymentIntent.id },
            include: { order: true }
        })

        if (!payment) {
            console.error(
                `[webhook] payment_intent.succeeded recebido pra PI ${paymentIntent.id}, ` +
                `mas nenhum Payment correspondente no DB`
            )
            return
        }

        if (payment.status === 'SUCCEEDED') {
            console.log(
                `[webhook] Payment ${payment.id} já estava SUCCEEDED, ignorando`
            )
            return
        }

        if (payment.order.status !== 'AWAITING_PAYMENT') {
            console.warn(
                `[webhook] Order ${payment.order.id} está em status ${payment.order.status}, ` +
                `esperado AWAITING_PAYMENT. Atualizando pagamento mas não o order.`
            )

            await prismaClient.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'SUCCEEDED',
                    paidAt: new Date(),
                }
            })

            return
        }

        await prismaClient.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'SUCCEEDED',
                    paidAt: new Date(),
                }
            })

            await tx.order.update({
                where: { id: payment.order.id },
                data: {
                    status: 'PENDING',
                    expiresAt: null,
                }
            })

            await tx.cartItem.deleteMany({
                where: {
                    cart: { user_id: payment.order.user_id }
                }
            })
        })

        console.log(
            `[webhook] Payment ${payment.id} confirmado. ` +
            `Order ${payment.order.id} → PENDING. Cart limpo.`
        )
    }
}