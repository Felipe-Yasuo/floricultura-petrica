'use client'

import { MapPin, Plus, Check } from 'lucide-react'
import { Address } from '@/types/address'

interface CheckoutAddressStepProps {
    addresses: Address[]
    selectedAddressId: string
    onSelectAddress: (id: string) => void
    onOpenNewAddress: () => void
}

export default function CheckoutAddressStep({
    addresses,
    selectedAddressId,
    onSelectAddress,
    onOpenNewAddress,
}: CheckoutAddressStepProps) {
    return (
        <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl">Endereço de Entrega</h2>
                <button
                    onClick={onOpenNewAddress}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-container)] text-sm font-medium hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                >
                    <Plus size={14} />
                    Novo
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mx-auto mb-3">
                        <MapPin size={22} className="text-[var(--color-foreground-muted)]" />
                    </div>
                    <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
                        Você ainda não tem endereços cadastrados.
                    </p>
                    <button
                        onClick={onOpenNewAddress}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:scale-[1.02] transition-all duration-300"
                    >
                        <Plus size={14} />
                        Adicionar Endereço
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {addresses.map((address) => {
                        const isSelected = address.id === selectedAddressId
                        return (
                            <button
                                key={address.id}
                                onClick={() => onSelectAddress(address.id)}
                                className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 ${isSelected
                                        ? 'border-[var(--color-primary)] bg-[var(--color-surface-container-low)]'
                                        : 'border-transparent bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)]'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-sm">
                                                {address.label || 'Endereço'}
                                            </h3>
                                            {address.isDefault && (
                                                <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs">
                                                    Padrão
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[var(--color-foreground-muted)]">
                                            {address.street}, {address.number}
                                            {address.complement && ` - ${address.complement}`}
                                        </p>
                                        <p className="text-sm text-[var(--color-foreground-muted)]">
                                            {address.neighborhood} — {address.city}/{address.state}
                                        </p>
                                        <p className="text-xs text-[var(--color-foreground-subtle)] mt-1">
                                            CEP: {address.zipCode}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                                            <Check size={14} className="text-[var(--color-on-primary)]" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}