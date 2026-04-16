'use client'

import { Fragment } from 'react'
import { ChevronDown } from 'lucide-react'
import { Order } from '@/types/order'
import { formatPrice } from '@/lib/utils'

interface OrderRowProps {
    order: Order
    isExpanded: boolean
    onToggleExpand: () => void
    onStatusChange: (newStatus: string) => void
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

export default function OrderRow({ order, isExpanded, onToggleExpand, onStatusChange }: OrderRowProps) {
    return (
        <Fragment>
            <tr
                onClick={onToggleExpand}
                className="border-b border-[var(--color-surface-container)] last:border-0 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200 cursor-pointer"
            >
                <td className="px-6 py-4 text-sm font-medium">
                    #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--color-foreground-muted)]">
                    {order.user?.name || 'Cliente'}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--color-foreground-muted)]">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                    {formatPrice(order.total)}
                </td>
                <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                        <select
                            value={order.status}
                            onChange={(e) => {
                                e.stopPropagation()
                                onStatusChange(e.target.value)
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1.5 rounded-full bg-[var(--color-surface-container)] text-xs font-medium outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300 appearance-none cursor-pointer"
                        >
                            {Object.entries(statusLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <ChevronDown
                            size={16}
                            className={`text-[var(--color-foreground-muted)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                                }`}
                        />
                    </div>
                </td>
            </tr>

            {isExpanded && (
                <tr>
                    <td colSpan={6} className="px-6 py-4 bg-[var(--color-surface-container-low)]">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] mb-3">
                                    Itens do Pedido
                                </h4>
                                <div className="flex flex-col gap-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[var(--color-surface-white)] shrink-0">
                                                <img
                                                    src={item.product.banner}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{item.product.name}</p>
                                                <p className="text-xs text-[var(--color-foreground-muted)]">
                                                    {item.quantity}x {formatPrice(item.price)}
                                                </p>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] mb-3">
                                    Endereço de Entrega
                                </h4>
                                {order.address && (
                                    <div className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                                        <p>{order.address.street}, {order.address.number}</p>
                                        <p>{order.address.neighborhood} — {order.address.city}/{order.address.state}</p>
                                    </div>
                                )}

                                {order.notes && (
                                    <div className="mt-4">
                                        <h4 className="text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] mb-2">
                                            Observações
                                        </h4>
                                        <p className="text-sm text-[var(--color-foreground-muted)]">
                                            {order.notes}
                                        </p>
                                    </div>
                                )}

                                {order.deliveryDate && (
                                    <div className="mt-4">
                                        <h4 className="text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] mb-2">
                                            Data de Entrega
                                        </h4>
                                        <p className="text-sm text-[var(--color-foreground-muted)]">
                                            {new Date(order.deliveryDate).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </Fragment>
    )
}