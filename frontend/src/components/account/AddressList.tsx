'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Trash2, Loader2, Star } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { Address } from '@/types/address'

export default function AddressesPage() {
    const router = useRouter()
    const { token, isAuthenticated, isLoading: authLoading } = useAuth()
    const [addresses, setAddresses] = useState<Address[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
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

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login')
            return
        }

        if (token) {
            fetchAddresses()
        }
    }, [token, authLoading, isAuthenticated])

    const fetchAddresses = async () => {
        try {
            const data = await api('/addresses', { token: token! })
            setAddresses(data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async () => {
        setError('')
        setSaving(true)

        try {
            await api('/addresses', {
                method: 'POST',
                token: token!,
                body: JSON.stringify(form),
            })
            setShowForm(false)
            setForm({ label: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '', isDefault: false })
            await fetchAddresses()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await api(`/addresses/${id}`, { method: 'DELETE', token: token! })
            await fetchAddresses()
        } catch (err) {
            console.error(err)
        }
    }

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                <h1 className="font-serif text-2xl lg:text-3xl">Meus Endereços</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:scale-[1.02] transition-all duration-300"
                >
                    <Plus size={16} />
                    Novo Endereço
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient mb-6">
                    {error && (
                        <div className="mb-4 p-4 rounded-2xl bg-red-50 text-red-600 text-sm">{error}</div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Apelido (ex: Casa, Trabalho)"
                            value={form.label}
                            onChange={(e) => setForm({ ...form, label: e.target.value })}
                            className="px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                        <input
                            type="text"
                            placeholder="CEP"
                            value={form.zipCode}
                            onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                            className="px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                        <input
                            type="text"
                            placeholder="Rua"
                            value={form.street}
                            onChange={(e) => setForm({ ...form, street: e.target.value })}
                            className="sm:col-span-2 px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                        <input
                            type="text"
                            placeholder="Número"
                            value={form.number}
                            onChange={(e) => setForm({ ...form, number: e.target.value })}
                            className="px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                        <input
                            type="text"
                            placeholder="Complemento"
                            value={form.complement}
                            onChange={(e) => setForm({ ...form, complement: e.target.value })}
                            className="px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                        <input
                            type="text"
                            placeholder="Bairro"
                            value={form.neighborhood}
                            onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                            className="px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                        <input
                            type="text"
                            placeholder="Cidade"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            className="px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />
                        <input
                            type="text"
                            placeholder="Estado (ex: PR)"
                            maxLength={2}
                            value={form.state}
                            onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
                            className="px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                        />

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
                            className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : 'Salvar'}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-6 py-3 rounded-2xl bg-[var(--color-surface-container)] text-sm font-medium hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Address List */}
            {addresses.length === 0 && !showForm ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mx-auto mb-4">
                        <MapPin size={28} className="text-[var(--color-foreground-muted)]" />
                    </div>
                    <h2 className="font-serif text-2xl mb-2">Nenhum endereço cadastrado</h2>
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                        Adicione um endereço para suas entregas.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className="rounded-3xl bg-[var(--color-surface-white)] p-6 shadow-ambient flex items-start justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-medium text-sm">{address.label || 'Endereço'}</h3>
                                    {address.isDefault && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs">
                                            <Star size={10} />
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
                            <button
                                onClick={() => handleDelete(address.id)}
                                className="p-2 rounded-full hover:bg-red-50 text-[var(--color-foreground-muted)] hover:text-red-500 transition-all duration-300"
                                aria-label="Remover endereço"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}