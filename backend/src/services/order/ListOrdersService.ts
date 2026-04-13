import prismaClient from '../../lib/prisma'

interface ListOrdersRequest {
    user_id: string
    role: string
}

export class ListOrdersService {
    async execute({ user_id, role }: ListOrdersRequest) {
        const where = role === 'ADMIN' ? {} : { user_id }

        const orders = await prismaClient.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                banner: true,
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
            },
            orderBy: { createdAt: 'desc' }
        })

        return orders
    }
}