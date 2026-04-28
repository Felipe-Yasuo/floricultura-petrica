'use client'

import { useEffect, useState } from 'react'
import { Package, Tag, ShoppingCart, Users, Loader2, MapPin } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Order } from '@/types/order'

interface Metrics {
    totalProducts: number
    totalCategories: number
    pendingOrders: number
    totalRevenue: number
    upcomingDeliveries: Order[]
}

const statusLabels: Record<string, string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    PREPARING: 'Preparando',
    DELIVERING: 'A Caminho',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-purple-100 text-purple-700',
    DELIVERING: 'bg-orange-100 text-orange-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
}

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING']

export default function DashboardOverview() {
    const { token } = useAuth()
    const [metrics, setMetrics] = useState<Metrics | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (token) {
            fetchMetrics()
        }
    }, [token])

    const fetchMetrics = async () => {
        try {
            const [productsRes, categoriesRes, ordersRes] = await Promise.all([
                api('/products/all', { token: token! }),
                api('/categories/all', { token: token! }),
                api('/orders', { token: token! }),
            ])

            const products = Array.isArray(productsRes) ? productsRes : productsRes.data ?? []
            const categories = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes.data ?? []
            const orders: Order[] = Array.isArray(ordersRes) ? ordersRes : ordersRes.data ?? []

            const totalRevenue = orders
                .filter((o) => o.status !== 'CANCELLED')
                .reduce((sum, o) => sum + o.total, 0)

            const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status))

            const upcomingDeliveries = [...activeOrders]
                .sort((a, b) => {
                    const da = a.deliveryDate ? new Date(a.deliveryDate).getTime() : Number.POSITIVE_INFINITY
                    const db = b.deliveryDate ? new Date(b.deliveryDate).getTime() : Number.POSITIVE_INFINITY
                    if (da !== db) return da - db
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                })
                .slice(0, 5)

            setMetrics({
                totalProducts: products.length,
                totalCategories: categories.length,
                pendingOrders: activeOrders.length,
                totalRevenue,
                upcomingDeliveries,
            })
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    const cards = [
        { label: 'Produtos', value: metrics?.totalProducts || 0, icon: Package, color: 'text-blue-600 bg-blue-50' },
        { label: 'Categorias', value: metrics?.totalCategories || 0, icon: Tag, color: 'text-purple-600 bg-purple-50' },
        { label: 'Pedidos a Entregar', value: metrics?.pendingOrders || 0, icon: ShoppingCart, color: 'text-orange-600 bg-orange-50' },
        { label: 'Receita Total', value: formatPrice(metrics?.totalRevenue || 0), icon: Users, color: 'text-green-600 bg-green-50' },
    ]

    return (
        <div>
            <h1 className="font-serif text-2xl lg:text-3xl mb-8">Dashboard</h1>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-3xl bg-[var(--color-surface-white)] p-6 shadow-ambient"
                    >
                        <div className={`w-10 h-10 rounded-2xl ${card.color} flex items-center justify-center mb-4`}>
                            <card.icon size={20} />
                        </div>
                        <p className="text-xs text-[var(--color-foreground-subtle)] tracking-[0.15em] uppercase mb-1">
                            {card.label}
                        </p>
                        <p className="text-2xl font-medium">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Próximas Entregas */}
            <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient">
                <h2 className="font-serif text-xl mb-6">Próximas Entregas</h2>

                {metrics?.upcomingDeliveries.length === 0 ? (
                    <p className="text-sm text-[var(--color-foreground-muted)] py-8 text-center">
                        Nenhuma entrega pendente.
                    </p>
                ) : (
                    <div className="flex flex-col gap-5">
                        {metrics?.upcomingDeliveries.map((order) => (
                            <div
                                key={order.id}
                                className="flex flex-col gap-4 py-5 border-b border-[var(--color-surface-container)] last:border-0 last:pb-0 first:pt-0"
                            >
                                {/* Cabeçalho */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium">Pedido #{order.id.slice(0, 8)}</p>
                                        <p className="text-xs text-[var(--color-foreground-muted)] mt-1">
                                            {order.user?.name || 'Cliente'}
                                            {order.deliveryDate && (
                                                <>
                                                    {' — entrega em '}
                                                    {new Date(order.deliveryDate).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                    })}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                            {statusLabels[order.status]}
                                        </span>
                                    </div>
                                </div>

                                {/* Itens a entregar */}
                                <div className="flex flex-col gap-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[var(--color-surface-container-low)] shrink-0">
                                                <img
                                                    src={item.product.banner}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.product.name}</p>
                                                <p className="text-xs text-[var(--color-foreground-muted)]">
                                                    {item.quantity}x {formatPrice(item.price)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Endereço */}
                                {order.address && (
                                    <div className="flex items-start gap-2 text-xs text-[var(--color-foreground-muted)]">
                                        <MapPin size={14} className="shrink-0 mt-0.5" />
                                        <span>
                                            {order.address.street}, {order.address.number} — {order.address.neighborhood}, {order.address.city}/{order.address.state}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
