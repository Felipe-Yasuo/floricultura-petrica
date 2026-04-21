'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Order } from '@/types/order'

const statusLabels: Record<string, string> = {
    AWAITING_PAYMENT: 'Aguardando Pagamento',
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    PREPARING: 'Preparando',
    DELIVERING: 'A Caminho',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
    EXPIRED: 'Expirado',
}

const statusColors: Record<string, string> = {
    AWAITING_PAYMENT: 'bg-amber-100 text-amber-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-purple-100 text-purple-700',
    DELIVERING: 'bg-orange-100 text-orange-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    EXPIRED: 'bg-gray-100 text-gray-700',
}

export default function OrdersPage() {
    const router = useRouter()
    const { token, isAuthenticated, isLoading: authLoading } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login')
            return
        }

        if (token) {
            fetchOrders()
        }
    }, [token, authLoading, isAuthenticated])

    const fetchOrders = async () => {
        try {
            const res = await api('/orders', { token: token! })
            setOrders(res.data || res)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mx-auto mb-4">
                    <Package size={28} className="text-[var(--color-foreground-muted)]" />
                </div>
                <h2 className="font-serif text-2xl mb-2">Nenhum pedido ainda</h2>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                    Seus pedidos aparecerão aqui após a primeira compra.
                </p>
            </div>
        )
    }

    return (
        <div>
            <h1 className="font-serif text-2xl lg:text-3xl mb-8">Meus Pedidos</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="rounded-3xl bg-[var(--color-surface-white)] p-6 shadow-ambient flex flex-col"
                    >
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="min-w-0">
                                <p className="text-xs text-[var(--color-foreground-subtle)] font-mono">
                                    #{order.id.slice(0, 8)}
                                </p>
                                <p className="text-xs text-[var(--color-foreground-muted)] mt-1">
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium shrink-0 ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                {statusLabels[order.status] ?? order.status}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 mb-4 flex-1">
                            {order.items.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--color-surface-container-low)] shrink-0">
                                        <img
                                            src={item.product.banner}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                                        <p className="text-xs text-[var(--color-foreground-muted)]">
                                            {item.quantity}× {formatPrice(item.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {order.items.length > 3 && (
                                <p className="text-xs text-[var(--color-foreground-subtle)] pl-15">
                                    +{order.items.length - 3} {order.items.length - 3 === 1 ? 'item' : 'itens'}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-[var(--color-surface-container)]">
                            <span className="text-sm text-[var(--color-foreground-muted)]">Total</span>
                            <span className="font-medium">{formatPrice(order.total)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}