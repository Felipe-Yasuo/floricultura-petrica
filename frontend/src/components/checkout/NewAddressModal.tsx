'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

interface NewAddressModalProps {
    onClose: () => void
    onCreated: (newAddressId: string) => void
}

export default function NewAddressModal({ onClose, onCreated }: NewAddressModalProps) {
    const { token } = useAuth()
    const [form, setForm] = useState({
        label: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false,
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        if (!token) return
        setError('')
        setSaving(true)
        try {
            const created = await api('/addresses', {
                method: 'POST',
                token,
                body: JSON.stringify(form),
            })
            onCreated(created.id)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar')
            setSaving(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl">Novo Endereço</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-[var(--color-surface-container)] transition-colors duration-300"
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 rounded-2xl bg-red-50 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="modal-addr-label" className="sr-only">Apelido</label>
                        <input
                            id="modal-addr-label"
                            type="text"
                            placeholder="Apelido (ex: Casa, Trabalho)"
                            value={form.label}
                            onChange={(e) => setForm({ ...form, label: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="modal-addr-zipCode" className="sr-only">CEP</label>
                        <input
                            id="modal-addr-zipCode"
                            type="text"
                            placeholder="CEP"
                            value={form.zipCode}
                            onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="modal-addr-street" className="sr-only">Rua</label>
                        <input
                            id="modal-addr-street"
                            type="text"
                            placeholder="Rua"
                            value={form.street}
                            onChange={(e) => setForm({ ...form, street: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="modal-addr-number" className="sr-only">Número</label>
                        <input
                            id="modal-addr-number"
                            type="text"
                            placeholder="Número"
                            value={form.number}
                            onChange={(e) => setForm({ ...form, number: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="modal-addr-complement" className="sr-only">Complemento</label>
                        <input
                            id="modal-addr-complement"
                            type="text"
                            placeholder="Complemento"
                            value={form.complement}
                            onChange={(e) => setForm({ ...form, complement: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="modal-addr-neighborhood" className="sr-only">Bairro</label>
                        <input
                            id="modal-addr-neighborhood"
                            type="text"
                            placeholder="Bairro"
                            value={form.neighborhood}
                            onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="modal-addr-city" className="sr-only">Cidade</label>
                        <input
                            id="modal-addr-city"
                            type="text"
                            placeholder="Cidade"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="modal-addr-state" className="sr-only">Estado</label>
                        <input
                            id="modal-addr-state"
                            type="text"
                            placeholder="Estado (ex: PR)"
                            maxLength={2}
                            value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
                            className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                    </div>

                    <label className="sm:col-span-2 flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.isDefault}
                            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                            className="w-4 h-4 rounded accent-[var(--color-primary)]"
                        />
                        <span className="text-sm text-[var(--color-foreground-muted)]">Endereço padrão</span>
                    </label>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : 'Salvar Endereço'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-2xl bg-[var(--color-surface-container)] text-sm font-medium hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}