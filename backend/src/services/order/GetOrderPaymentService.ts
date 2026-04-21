import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface GetOrderPaymentRequest {
    order_id: string
    user_id: string
}

export class GetOrderPaymentService {
    async execute({ order_id, user_id }: GetOrderPaymentRequest) {
        const order = await prismaClient.order.findUnique({
            where: { id: order_id },
            include: { payment: true },
        })

        if (!order || order.user_id !== user_id) {
            throw new AppError('Pedido não encontrado', 404)
        }

        if (order.status !== 'AWAITING_PAYMENT') {
            throw new AppError(
                `Pedido não está aguardando pagamento (status: ${order.status})`,
                400
            )
        }

        if (!order.payment || !order.payment.stripeClientSecret) {
            throw new AppError('Dados de pagamento não encontrados', 500)
        }

        return {
            clientSecret: order.payment.stripeClientSecret,
            amount: order.total,
            orderId: order.id,
        }
    }
}