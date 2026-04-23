'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { Order } from '@/types/order'
import ConfirmModal from '@/components/ui/ConfirmModal'
import OrderRow from './OrderRow'
import OrderCard from './OrderCard'

interface OrdersTableProps {
    orders: Order[]
    onUpdateStatus: (orderId: string, status: string) => void
}

const statusLabels: Record<string, string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    PREPARING: 'Preparando',
    DELIVERING: 'A Caminho',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
}

const criticalStatuses = ['DELIVERED', 'CANCELLED']

type FilterStatus = 'all' | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED'

export default function OrdersTable({ orders, onUpdateStatus }: OrdersTableProps) {
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
    const [pendingChange, setPendingChange] = useState<{ orderId: string; newStatus: string } | null>(null)
    const debouncedSearch = useDebounce(search)

    const filtered = useMemo(() => {
        let result = [...orders]

        if (debouncedSearch) {
            result = result.filter((o) =>
                o.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                o.user?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        }

        if (filterStatus !== 'all') {
            result = result.filter((o) => o.status === filterStatus)
        }

        return result
    }, [orders, debouncedSearch, filterStatus])

    const handleStatusChange = (orderId: string, newStatus: string) => {
        if (criticalStatuses.includes(newStatus)) {
            setPendingChange({ orderId, newStatus })
        } else {
            onUpdateStatus(orderId, newStatus)
        }
    }

    const confirmChange = () => {
        if (pendingChange) {
            onUpdateStatus(pendingChange.orderId, pendingChange.newStatus)
            setPendingChange(null)
        }
    }

    return (
        <>
            <div className="rounded-3xl bg-[var(--color-surface-white)] shadow-ambient overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-3 p-6 border-b border-[var(--color-surface-container)]">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-foreground-subtle)]" />
                        <input
                            type="text"
                            placeholder="Buscar por ID ou cliente..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-5 py-2.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                        className="px-4 py-2.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300 appearance-none cursor-pointer"
                    >
                        <option value="all">Todos os Status</option>
                        {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                {/* Desktop: tabela */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--color-surface-container)]">
                                <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Pedido</th>
                                <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Cliente</th>
                                <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Data</th>
                                <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Total</th>
                                <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Status</th>
                                <th className="text-right text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-[var(--color-foreground-muted)]">
                                        Nenhum pedido encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((order) => (
                                    <OrderRow
                                        key={order.id}
                                        order={order}
                                        isExpanded={expandedOrder === order.id}
                                        onToggleExpand={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                        onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile: cards */}
                <div className="md:hidden">
                    {filtered.length === 0 ? (
                        <div className="px-5 py-12 text-center text-sm text-[var(--color-foreground-muted)]">
                            Nenhum pedido encontrado.
                        </div>
                    ) : (
                        filtered.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                isExpanded={expandedOrder === order.id}
                                onToggleExpand={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                            />
                        ))
                    )}
                </div>
            </div>

            <ConfirmModal
                open={!!pendingChange}
                title={pendingChange?.newStatus === 'CANCELLED' ? 'Cancelar Pedido' : 'Marcar como Entregue'}
                description={
                    pendingChange?.newStatus === 'CANCELLED'
                        ? 'Tem certeza que deseja cancelar este pedido? Esta ação pode afetar o estoque dos produtos.'
                        : 'Confirmar que o pedido foi entregue? O cliente será notificado.'
                }
                variant={pendingChange?.newStatus === 'CANCELLED' ? 'danger' : 'primary'}
                onConfirm={confirmChange}
                onCancel={() => setPendingChange(null)}
            />
        </>
    )
}