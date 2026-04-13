import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface CreateOrderRequest {
    user_id: string
    address_id: string
    deliveryDate?: string
    notes?: string
}

export class CreateOrderService {
    async execute({ user_id, address_id, deliveryDate, notes }: CreateOrderRequest) {
        const address = await prismaClient.address.findUnique({
            where: { id: address_id }
        })

        if (!address || address.user_id !== user_id) {
            throw new AppError('Endereço não encontrado', 404)
        }

        const cart = await prismaClient.cart.findUnique({
            where: { user_id },
            include: {
                items: {
                    include: { product: true }
                }
            }
        })

        if (!cart || cart.items.length === 0) {
            throw new AppError('Carrinho está vazio', 400)
        }

        for (const item of cart.items) {
            if (item.product.disabled) {
                throw new AppError(`Produto "${item.product.name}" não está mais disponível`, 400)
            }

            if (item.product.stock < item.quantity) {
                throw new AppError(`Estoque insuficiente para "${item.product.name}"`, 400)
            }
        }

        
        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity)
        }, 0)

        const order = await prismaClient.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    user_id,
                    address_id,
                    total,
                    deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
                    notes,
                    items: {
                        create: cart.items.map((item) => ({
                            product_id: item.product_id,
                            quantity: item.quantity,
                            price: item.product.price,
                        }))
                    }
                },
                include: {
                    items: {
                        include: { product: true }
                    },
                    address: true,
                }
            })

            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: { stock: { decrement: item.quantity } }
                })
            }

            await tx.cartItem.deleteMany({
                where: { cart_id: cart.id }
            })

            return newOrder
        })

        return order
    }
}