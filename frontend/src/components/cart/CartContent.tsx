'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartContent() {
    const router = useRouter()
    const { isAuthenticated, isLoading: authLoading } = useAuth()
    const { cart, isLoading, fetchCart, updateItem, removeItem } = useCart()

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login')
            return
        }

        if (isAuthenticated) {
            fetchCart()
        }
    }, [isAuthenticated, authLoading])

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    if (cart.items.length === 0) {
        return (
            <div className="text-center py-32">
                <div className="w-20 h-20 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={32} className="text-[var(--color-foreground-muted)]" />
                </div>
                <h1 className="font-serif text-3xl mb-3">Seu carrinho está vazio</h1>
                <p className="text-[var(--color-foreground-muted)] mb-8">
                    Explore nossa coleção e encontre o arranjo perfeito.
                </p>
                <Link
                    href="/shop"
                    className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:scale-[1.02] transition-all duration-300"
                >
                    Explorar Coleção
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>
        )
    }

    return (
        <div>
            <h1 className="font-serif text-3xl lg:text-4xl mb-10">Seu Carrinho</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Items */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {cart.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-4 lg:gap-6 p-4 rounded-3xl bg-[var(--color-surface-white)] shadow-ambient"
                        >
                            {/* Image */}
                            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden bg-[var(--color-surface-container-low)] shrink-0">
                                <img
                                    src={item.product.banner}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-serif text-base lg:text-lg">{item.product.name}</h3>
                                    <p className="text-sm text-[var(--color-foreground-muted)] mt-1">
                                        {formatPrice(item.product.price)} cada
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    {/* Quantity */}
                                    <div className="flex items-center rounded-xl bg-[var(--color-surface-container)] overflow-hidden">
                                        <button
                                            onClick={() => {
                                                if (item.quantity <= 1) {
                                                    removeItem(item.id)
                                                } else {
                                                    updateItem(item.id, item.quantity - 1)
                                                }
                                            }}
                                            className="w-9 h-9 flex items-center justify-center hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                                            aria-label="Diminuir quantidade"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateItem(item.id, item.quantity + 1)}
                                            className="w-9 h-9 flex items-center justify-center hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                                            aria-label="Aumentar quantidade"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Price & Remove */}
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium text-sm">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 rounded-full hover:bg-red-50 text-[var(--color-foreground-muted)] hover:text-red-500 transition-all duration-300"
                                            aria-label="Remover item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient sticky top-28">
                        <h2 className="font-serif text-xl mb-6">Resumo do Pedido</h2>

                        <div className="flex flex-col gap-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--color-foreground-muted)]">Subtotal</span>
                                <span>{formatPrice(cart.total)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--color-foreground-muted)]">Entrega</span>
                                <span className="text-[var(--color-primary)]">Grátis</span>
                            </div>
                        </div>

                        <div className="border-t border-[var(--color-surface-container-high)] pt-4 mb-6">
                            <div className="flex justify-between">
                                <span className="font-medium">Total</span>
                                <span className="font-serif text-xl">{formatPrice(cart.total)}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="group w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:scale-[1.01] transition-all duration-300"
                        >
                            Finalizar Pedido
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>

                        <Link
                            href="/shop"
                            className="block text-center text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors duration-300 mt-4"
                        >
                            Continuar comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}