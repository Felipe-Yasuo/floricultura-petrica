import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface AddCartItemRequest {
    user_id: string
    product_id: string
    quantity: number
}

export class AddCartItemService {
    async execute({ user_id, product_id, quantity }: AddCartItemRequest) {
        const product = await prismaClient.product.findUnique({
            where: { id: product_id }
        })

        if (!product || product.disabled) {
            throw new AppError('Produto não encontrado', 404)
        }

        if (product.stock < quantity) {
            throw new AppError('Estoque insuficiente', 400)
        }

        let cart = await prismaClient.cart.findUnique({
            where: { user_id }
        })

        if (!cart) {
            cart = await prismaClient.cart.create({
                data: { user_id }
            })
        }

        const existingItem = await prismaClient.cartItem.findUnique({
            where: {
                cart_id_product_id: {
                    cart_id: cart.id,
                    product_id,
                }
            }
        })

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity

            if (product.stock < newQuantity) {
                throw new AppError('Estoque insuficiente', 400)
            }

            const updated = await prismaClient.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
                include: { product: true }
            })

            return updated
        }

        const item = await prismaClient.cartItem.create({
            data: {
                cart_id: cart.id,
                product_id,
                quantity,
            },
            include: { product: true }
        })

        return item
    }
}