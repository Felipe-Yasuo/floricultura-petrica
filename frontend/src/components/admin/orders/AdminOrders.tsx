'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { Order } from '@/types/order'
import OrdersTable from './OrdersTable'

export default function AdminOrders() {
    const { token } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOrders = useCallback(
        async (signal?: AbortSignal) => {
            if (!token) return
            try {
                setError(null)
                const res = await api('/orders', { token, signal })
                const data: Order[] = Array.isArray(res) ? res : res.data ?? []
                if (!signal?.aborted) setOrders(data)
            } catch (err) {
                if ((err as Error).name === 'AbortError') return
                console.error(err)
                setError('Não foi possível carregar os pedidos. Tente novamente.')
            } finally {
                if (!signal?.aborted) setIsLoading(false)
            }
        },
        [token]
    )

    useEffect(() => {
        const controller = new AbortController()
        fetchOrders(controller.signal)
        return () => controller.abort()
    }, [fetchOrders])

    const handleUpdateStatus = async (orderId: string, status: string) => {
        if (!token) return

        // Update otimista
        const previous = orders
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: status as Order['status'] } : o))
        )

        try {
            await api(`/orders/${orderId}/status`, {
                method: 'PATCH',
                token,
                body: JSON.stringify({ status }),
            })
        } catch (err) {
            console.error(err)
            setOrders(previous) // reverte
            setError('Não foi possível atualizar o status do pedido.')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    return (
        <div>
            <h1 className="font-serif text-2xl lg:text-3xl mb-8">Pedidos</h1>

            {error && (
                <div className="flex items-center gap-3 mb-6 px-5 py-4 rounded-2xl bg-red-50 text-red-700 text-sm">
                    <AlertCircle size={18} className="shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="text-xs font-medium uppercase tracking-wider hover:underline"
                    >
                        Fechar
                    </button>
                </div>
            )}

            <OrdersTable orders={orders} onUpdateStatus={handleUpdateStatus} />
        </div>
    )
}