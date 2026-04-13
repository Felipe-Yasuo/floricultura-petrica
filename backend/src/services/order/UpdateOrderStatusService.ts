import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'
import { OrderStatus } from '../../generated/prisma/client'
interface UpdateOrderStatusRequest {
    id: string
    status: OrderStatus
}

export class UpdateOrderStatusService {
    async execute({ id, status }: UpdateOrderStatusRequest) {
        const order = await prismaClient.order.findUnique({
            where: { id }
        })

        if (!order) {
            throw new AppError('Pedido não encontrado', 404)
        }

        if (order.status === 'CANCELLED') {
            throw new AppError('Pedido cancelado não pode ser alterado', 400)
        }

        if (order.status === 'DELIVERED') {
            throw new AppError('Pedido entregue não pode ser alterado', 400)
        }

        const updated = await prismaClient.order.update({
            where: { id },
            data: { status }
        })

        return updated
    }
}