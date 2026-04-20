import Stripe from 'stripe'
import prismaClient from '../../lib/prisma'

export class HandlePaymentFailedService {
    async execute(paymentIntent: Stripe.PaymentIntent): Promise<void> {
        const payment = await prismaClient.payment.findUnique({
            where: { stripePaymentIntentId: paymentIntent.id },
            include: {
                order: {
                    include: { items: true }
                }
            }
        })

        if (!payment) {
            console.error(
                `[webhook] payment_intent.payment_failed recebido pra PI ${paymentIntent.id}, ` +
                `mas nenhum Payment correspondente no DB`
            )
            return
        }

        if (payment.status === 'FAILED' || payment.status === 'SUCCEEDED') {
            console.log(
                `[webhook] Payment ${payment.id} já está em ${payment.status}, ignorando`
            )
            return
        }

        if (payment.order.status !== 'AWAITING_PAYMENT') {
            console.warn(
                `[webhook] Order ${payment.order.id} está em status ${payment.order.status}, ` +
                `esperado AWAITING_PAYMENT. Marcando pagamento como FAILED sem tocar no order.`
            )

            await prismaClient.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'FAILED',
                    failureReason: paymentIntent.last_payment_error?.message ?? 'desconhecido',
                }
            })

            return
        }

        const failureReason = paymentIntent.last_payment_error?.message ?? 'desconhecido'

        await prismaClient.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'FAILED',
                    failureReason,
                }
            })

            await tx.order.update({
                where: { id: payment.order.id },
                data: {
                    status: 'CANCELLED',
                    expiresAt: null,
                }
            })

            for (const item of payment.order.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: { stock: { increment: item.quantity } }
                })
            }
        })

        console.log(
            `[webhook] Payment ${payment.id} falhou (${failureReason}). ` +
            `Order ${payment.order.id} → CANCELLED. Stock devolvido.`
        )
    }
}