import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface CancelOrderRequest {
    id: string
    user_id: string
}

export class CancelOrderService {
    async execute({ id, user_id }: CancelOrderRequest) {
        const order = await prismaClient.order.findUnique({
            where: { id },
            include: { items: true }
        })

        if (!order || order.user_id !== user_id) {
            throw new AppError('Pedido não encontrado', 404)
        }

        if (order.status !== 'PENDING') {
            throw new AppError('Apenas pedidos pendentes podem ser cancelados', 400)
        }

        const cancelled = await prismaClient.$transaction(async (tx) => {
            const updated = await tx.order.update({
                where: { id },
                data: { status: 'CANCELLED' }
            })

            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: { stock: { increment: item.quantity } }
                })
            }

            return updated
        })

        return cancelled
    }
}