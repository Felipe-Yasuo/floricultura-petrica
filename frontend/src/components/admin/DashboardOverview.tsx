'use client'

import { useEffect, useState } from 'react'
import { Package, Tag, ShoppingCart, Users, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

interface Metrics {
    totalProducts: number
    totalCategories: number
    totalOrders: number
    totalRevenue: number
    recentOrders: any[]
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
                api('/products'),
                api('/categories'),
                api('/orders', { token: token! }),
            ])

            const products = productsRes.data || productsRes
            const categories = categoriesRes
            const orders = ordersRes.data || ordersRes

            const totalRevenue = orders
                .filter((o: any) => o.status !== 'CANCELLED')
                .reduce((sum: number, o: any) => sum + o.total, 0)

            setMetrics({
                totalProducts: products.length,
                totalCategories: categories.length,
                totalOrders: orders.length,
                totalRevenue,
                recentOrders: orders.slice(0, 5),
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
        { label: 'Pedidos', value: metrics?.totalOrders || 0, icon: ShoppingCart, color: 'text-orange-600 bg-orange-50' },
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

            {/* Recent Orders */}
            <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient">
                <h2 className="font-serif text-xl mb-6">Pedidos Recentes</h2>

                {metrics?.recentOrders.length === 0 ? (
                    <p className="text-sm text-[var(--color-foreground-muted)] py-8 text-center">
                        Nenhum pedido ainda.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {metrics?.recentOrders.map((order: any) => (
                            <div
                                key={order.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-[var(--color-surface-container)] last:border-0"
                            >
                                <div>
                                    <p className="text-sm font-medium">Pedido #{order.id.slice(0, 8)}</p>
                                    <p className="text-xs text-[var(--color-foreground-muted)] mt-1">
                                        {order.user?.name || 'Cliente'} — {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                        {statusLabels[order.status]}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}