'use client'

import { ChevronDown } from 'lucide-react'
import { Order } from '@/types/order'
import { formatPrice } from '@/lib/utils'

interface OrderCardProps {
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

export default function OrderCard({ order, isExpanded, onToggleExpand, onStatusChange }: OrderCardProps) {
    return (
        <div className="border-b border-[var(--color-surface-container)] last:border-0">
            {/* Área clicável que abre/fecha o card */}
            <button
                onClick={onToggleExpand}
                className="w-full text-left px-5 py-4 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200"
            >
                {/* Linha 1: ID + Status */}
                <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm font-medium">
                        #{order.id.slice(0, 8)}
                    </span>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                    </span>
                </div>

                {/* Linha 2: Cliente + Data */}
                <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm text-[var(--color-foreground-muted)] truncate">
                        {order.user?.name || 'Cliente'}
                    </span>
                    <span className="text-xs text-[var(--color-foreground-subtle)] shrink-0">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                </div>

                {/* Linha 3: Total + Chevron */}
                <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-medium">
                        {formatPrice(order.total)}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-[var(--color-foreground-muted)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                            }`}
                    />
                </div>
            </button>

            {/* Controle de status — fora do botão pra não propagar o clique */}
            <div className="px-5 pb-4" onClick={(e) => e.stopPropagation()}>
                <select
                    value={order.status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[var(--color-surface-container)] text-xs font-medium outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300 appearance-none cursor-pointer"
                >
                    {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Conteúdo expandido */}
            {isExpanded && (
                <div className="px-5 pb-5 pt-2 bg-[var(--color-surface-container-low)]">
                    <div className="flex flex-col gap-6">
                        {/* Itens do Pedido */}
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
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                                            <p className="text-xs text-[var(--color-foreground-muted)]">
                                                {item.quantity}x {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium shrink-0">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Endereço de Entrega */}
                        {order.address && (
                            <div>
                                <h4 className="text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] mb-3">
                                    Endereço de Entrega
                                </h4>
                                <div className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                                    <p>{order.address.street}, {order.address.number}</p>
                                    <p>{order.address.neighborhood} — {order.address.city}/{order.address.state}</p>
                                </div>
                            </div>
                        )}

                        {/* Observações */}
                        {order.notes && (
                            <div>
                                <h4 className="text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] mb-2">
                                    Observações
                                </h4>
                                <p className="text-sm text-[var(--color-foreground-muted)]">
                                    {order.notes}
                                </p>
                            </div>
                        )}

                        {/* Data de Entrega */}
                        {order.deliveryDate && (
                            <div>
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
            )}
        </div>
    )
}