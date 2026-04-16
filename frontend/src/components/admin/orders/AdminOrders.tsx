'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { Order } from '@/types/order'
import OrdersTable from './OrdersTable'

export default function AdminOrders() {
    const { token } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (token) {
            fetchOrders()
        }
    }, [token])

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

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            await api(`/orders/${orderId}/status`, {
                method: 'PATCH',
                token: token!,
                body: JSON.stringify({ status }),
            })
            await fetchOrders()
        } catch (err) {
            console.error(err)
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

            <OrdersTable
                orders={orders}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    )
}