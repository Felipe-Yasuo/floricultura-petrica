import prismaClient from '../../lib/prisma'
import { stripe } from '../../config/stripe'

interface ExpireResult {
    processed: number
    succeeded: number
    failed: number
    errors: Array<{ orderId: string; error: string }>
}

export class ExpireStaleOrdersService {
    async execute(): Promise<ExpireResult> {
        const staleOrders = await prismaClient.order.findMany({
            where: {
                status: 'AWAITING_PAYMENT',
                expiresAt: { lt: new Date() },
            },
            include: {
                items: true,
                payment: true,
            },
        })

        const result: ExpireResult = {
            processed: staleOrders.length,
            succeeded: 0,
            failed: 0,
            errors: [],
        }

        if (staleOrders.length === 0) {
            return result
        }

        console.log(`[cleanup] ${staleOrders.length} orders expirados encontrados`)

        for (const order of staleOrders) {
            try {
                await this.expireOrder(order.id, order.items, order.payment?.stripePaymentIntentId)
                result.succeeded++
                console.log(`[cleanup] Order ${order.id} expirado com sucesso`)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'erro desconhecido'
                result.failed++
                result.errors.push({ orderId: order.id, error: message })
                console.error(`[cleanup] falha ao expirar Order ${order.id}: ${message}`)
            }
        }

        console.log(
            `[cleanup] concluído: ${result.succeeded} sucesso, ${result.failed} falha`
        )

        return result
    }

    private async expireOrder(
        orderId: string,
        items: Array<{ product_id: string; quantity: number }>,
        stripePaymentIntentId: string | undefined
    ): Promise<void> {
        await prismaClient.$transaction(async (tx) => {
            const currentOrder = await tx.order.findUnique({
                where: { id: orderId },
                select: { status: true },
            })

            if (!currentOrder || currentOrder.status !== 'AWAITING_PAYMENT') {
                throw new Error(
                    `Order não está mais em AWAITING_PAYMENT (status atual: ${currentOrder?.status ?? 'não encontrado'})`
                )
            }

            await tx.order.update({
                where: { id: orderId },
                data: {
                    status: 'EXPIRED',
                    expiresAt: null,
                },
            })

            if (this.hasPayment(stripePaymentIntentId)) {
                await tx.payment.update({
                    where: { order_id: orderId },
                    data: { status: 'FAILED', failureReason: 'Order expirado por timeout' },
                })
            }

            for (const item of items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: { stock: { increment: item.quantity } },
                })
            }
        })

        if (this.hasPayment(stripePaymentIntentId)) {
            try {
                await stripe.paymentIntents.cancel(stripePaymentIntentId)
            } catch (err) {
                const message = err instanceof Error ? err.message : 'erro desconhecido'
                console.warn(
                    `[cleanup] falha ao cancelar PI ${stripePaymentIntentId} na Stripe: ${message}. ` +
                    `Order ${orderId} já foi marcado como EXPIRED no DB.`
                )
            }
        }
    }

    private hasPayment(stripePaymentIntentId: string | undefined): stripePaymentIntentId is string {
        return typeof stripePaymentIntentId === 'string' && stripePaymentIntentId.length > 0
    }
}