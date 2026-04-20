import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'
import { stripe, STRIPE_CURRENCY } from '../../config/stripe'
import { env } from '../../config/env'

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

        const expiresAt = new Date(
            Date.now() + env.STRIPE_PAYMENT_INTENT_EXPIRATION_MINUTES * 60 * 1000
        )

        const result = await prismaClient.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    user_id,
                    address_id,
                    total,
                    status: 'AWAITING_PAYMENT',
                    expiresAt,
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
                    items: { include: { product: true } },
                    address: true,
                }
            })

            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: { stock: { decrement: item.quantity } }
                })
            }

            const paymentIntent = await stripe.paymentIntents.create(
                {
                    amount: total,
                    currency: STRIPE_CURRENCY,
                    metadata: {
                        order_id: newOrder.id,
                        user_id,
                    },
                    automatic_payment_methods: { enabled: true },
                },
                {
                    idempotencyKey: `order-${newOrder.id}`,
                }
            )

            if (!paymentIntent.client_secret) {
                throw new AppError('Falha ao iniciar pagamento', 500)
            }

            await tx.payment.create({
                data: {
                    order_id: newOrder.id,
                    amount: total,
                    currency: STRIPE_CURRENCY,
                    stripePaymentIntentId: paymentIntent.id,
                    stripeClientSecret: paymentIntent.client_secret,
                    status: 'PENDING',
                }
            })

            return { order: newOrder, clientSecret: paymentIntent.client_secret }
        }, {
            timeout: 15000,
        })

        return result
    }
}