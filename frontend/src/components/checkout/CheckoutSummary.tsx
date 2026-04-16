'use client'

import { Loader2, CheckCircle } from 'lucide-react'
import { Cart } from '@/types/cart'
import { formatPrice } from '@/lib/utils'

interface CheckoutSummaryProps {
    cart: Cart
    onConfirm: () => void
    submitting: boolean
    canSubmit: boolean
}

export default function CheckoutSummary({ cart, onConfirm, submitting, canSubmit }: CheckoutSummaryProps) {
    return (
        <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient sticky top-28">
            <h2 className="font-serif text-xl mb-6">Resumo do Pedido</h2>

            {/* Items resumidos */}
            <div className="flex flex-col gap-3 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-surface-container-low)] shrink-0">
                            <img
                                src={item.product.banner}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                            <p className="text-xs text-[var(--color-foreground-muted)]">
                                {item.quantity}x {formatPrice(item.product.price)}
                            </p>
                        </div>
                        <span className="text-sm font-medium shrink-0">
                            {formatPrice(item.product.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Totais */}
            <div className="flex flex-col gap-2 mb-6 border-t border-[var(--color-surface-container-high)] pt-4">
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

            <button
                onClick={onConfirm}
                disabled={!canSubmit || submitting}
                className="group w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {submitting ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Processando...
                    </>
                ) : (
                    <>
                        <CheckCircle size={16} />
                        Confirmar Pedido
                    </>
                )}
            </button>

            <p className="text-xs text-[var(--color-foreground-subtle)] text-center mt-4">
                Ao confirmar, você concorda com nossos termos de entrega.
            </p>
        </div>
    )
}