import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'
import { stripe } from '../../config/stripe'

interface CancelOrderRequest {
    id: string
    user_id: string
}

type OrderWithRelations = NonNullable<Awaited<
    ReturnType<typeof prismaClient.order.findUnique<{
        where: { id: string }
        include: { items: true; payment: true }
    }>>
>>

export class CancelOrderService {
    async execute({ id, user_id }: CancelOrderRequest) {
        const order = await prismaClient.order.findUnique({
            where: { id },
            include: {
                items: true,
                payment: true,
            },
        })

        if (!order || order.user_id !== user_id) {
            throw new AppError('Pedido não encontrado', 404)
        }

        if (order.status === 'AWAITING_PAYMENT') {
            return this.cancelAwaitingPayment(order)
        }

        if (order.status === 'PENDING') {
            return this.cancelPaidOrder(order)
        }

        throw new AppError(
            `Pedido com status "${order.status}" não pode ser cancelado`,
            400
        )
    }

    private async cancelAwaitingPayment(order: OrderWithRelations) {
        const cancelled = await prismaClient.$transaction(async (tx) => {
            const updated = await tx.order.update({
                where: { id: order.id },
                data: {
                    status: 'CANCELLED',
                    expiresAt: null,
                },
            })

            if (order.payment) {
                await tx.payment.update({
                    where: { id: order.payment.id },
                    data: {
                        status: 'FAILED',
                        failureReason: 'Cancelado pelo cliente',
                    },
                })
            }

            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: { stock: { increment: item.quantity } },
                })
            }

            return updated
        })

        if (order.payment?.stripePaymentIntentId) {
            try {
                await stripe.paymentIntents.cancel(order.payment.stripePaymentIntentId)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'erro desconhecido'
                console.warn(
                    `[cancel] falha ao cancelar PI ${order.payment.stripePaymentIntentId}: ${message}. ` +
                    `Order ${order.id} já foi cancelado no DB.`
                )
            }
        }

        return cancelled
    }

    private async cancelPaidOrder(order: OrderWithRelations) {
        if (!order.payment || !order.payment.stripePaymentIntentId) {
            throw new AppError(
                'Pedido pago sem registro de pagamento. Contate o suporte.',
                500
            )
        }

        try {
            await stripe.refunds.create({
                payment_intent: order.payment.stripePaymentIntentId,
                reason: 'requested_by_customer',
                metadata: {
                    order_id: order.id,
                },
            })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'erro desconhecido'
            console.error(`[cancel] refund falhou para order ${order.id}: ${message}`)
            throw new AppError('Não foi possível processar o reembolso. Tente novamente.', 500)
        }

        const cancelled = await prismaClient.$transaction(async (tx) => {
            const updated = await tx.order.update({
                where: { id: order.id },
                data: { status: 'CANCELLED' },
            })

            await tx.payment.update({
                where: { id: order.payment!.id },
                data: { status: 'REFUNDED' },
            })

            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: { stock: { increment: item.quantity } },
                })
            }

            return updated
        })

        return cancelled
    }
}

