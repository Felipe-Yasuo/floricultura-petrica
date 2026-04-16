'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

export default function CheckoutSuccess() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('order')

    return (
        <div className="max-w-xl mx-auto text-center py-16 lg:py-24">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
            </div>

            <h1 className="font-serif text-3xl lg:text-4xl mb-4">Pedido Confirmado!</h1>

            <p className="text-[var(--color-foreground-muted)] mb-2">
                Recebemos seu pedido e já estamos preparando cada detalhe com carinho.
            </p>

            {orderId && (
                <p className="text-sm text-[var(--color-foreground-subtle)] mb-8">
                    Número do pedido: <span className="font-mono font-medium">#{orderId.slice(0, 8)}</span>
                </p>
            )}

            <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient mb-8 text-left">
                <h2 className="font-serif text-lg mb-4">Próximos passos</h2>
                <ul className="flex flex-col gap-3 text-sm text-[var(--color-foreground-muted)]">
                    <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-xs font-medium shrink-0">
                            1
                        </span>
                        Você receberá um email de confirmação em instantes.
                    </li>
                    <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-xs font-medium shrink-0">
                            2
                        </span>
                        Nossa equipe prepara seu pedido com flores frescas do dia.
                    </li>
                    <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-xs font-medium shrink-0">
                            3
                        </span>
                        Acompanhe o status pela sua área de pedidos.
                    </li>
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {orderId && (
                    <Link
                        href={`/orders/${orderId}`}
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:scale-[1.02] transition-all duration-300"
                    >
                        <Package size={16} />
                        Ver Pedido
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                )}
                <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--color-surface-container)] text-sm font-medium hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                >
                    Continuar comprando
                </Link>
            </div>
        </div>
    )
}