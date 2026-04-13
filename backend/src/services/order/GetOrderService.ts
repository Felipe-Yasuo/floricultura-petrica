import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface GetOrderRequest {
    id: string
    user_id: string
    role: string
}

export class GetOrderService {
    async execute({ id, user_id, role }: GetOrderRequest) {
        const order = await prismaClient.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                banner: true,
                                price: true,
                            }
                        }
                    }
                },
                address: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        })

        if (!order) {
            throw new AppError('Pedido não encontrado', 404)
        }

        if (role !== 'ADMIN' && order.user_id !== user_id) {
            throw new AppError('Pedido não encontrado', 404)
        }

        return order
    }
}