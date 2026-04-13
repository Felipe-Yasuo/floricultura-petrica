import prismaClient from '../../lib/prisma'

export class GetCartService {
    async execute(user_id: string) {
        const cart = await prismaClient.cart.findUnique({
            where: { user_id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                banner: true,
                                stock: true,
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        if (!cart) {
            return { items: [], total: 0 }
        }

        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity)
        }, 0)

        return { items: cart.items, total }
    }
}