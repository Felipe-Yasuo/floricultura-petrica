'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { api } from '@/lib/api'
import { Address } from '@/types/address'
import CheckoutAddressStep from './CheckoutAddressStep'
import CheckoutDetailsStep from './CheckoutDetailsStep'
import CheckoutSummary from './CheckoutSummary'
import NewAddressModal from './NewAddressModal'

export default function CheckoutContent() {
    const router = useRouter()
    const { token, isAuthenticated, isLoading: authLoading } = useAuth()
    const { cart, isLoading: cartLoading, fetchCart } = useCart()

    const [addresses, setAddresses] = useState<Address[]>([])
    const [loadingAddresses, setLoadingAddresses] = useState(true)
    const [selectedAddressId, setSelectedAddressId] = useState<string>('')
    const [deliveryDate, setDeliveryDate] = useState('')
    const [notes, setNotes] = useState('')
    const [showNewAddressModal, setShowNewAddressModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [submitted, setSubmitted] = useState(false)

    // Auth guard + carregar dados
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login')
            return
        }

        if (isAuthenticated) {
            fetchCart()
            fetchAddresses()
        }
    }, [isAuthenticated, authLoading])

    // Se o carrinho ficar vazio em algum momento, volta pro carrinho
    useEffect(() => {
        if (submitted) return
        if (!cartLoading && isAuthenticated && cart.items.length === 0) {
            router.push('/cart')
        }
    }, [cart.items.length, cartLoading, isAuthenticated, submitted])

    const fetchAddresses = async () => {
        if (!token) return
        setLoadingAddresses(true)
        try {
            const data = await api('/addresses', { token })
            setAddresses(data)

            // Seleciona automaticamente o endereço padrão ou o primeiro
            const defaultAddr = data.find((a: Address) => a.isDefault)
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id)
            } else if (data.length > 0) {
                setSelectedAddressId(data[0].id)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingAddresses(false)
        }
    }

    const handleAddressCreated = async (newAddressId: string) => {
        setShowNewAddressModal(false)
        if (!token) return
        try {
            const data = await api('/addresses', { token })
            setAddresses(data)
            setSelectedAddressId(newAddressId)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmit = async () => {
        setError('')

        if (!selectedAddressId) {
            setError('Selecione um endereço de entrega.')
            return
        }

        if (!deliveryDate) {
            setError('Escolha uma data de entrega.')
            return
        }

        if (!token) return

        setSubmitting(true)
        try {
            const order = await api('/orders', {
                method: 'POST',
                token,
                body: JSON.stringify({
                    address_id: selectedAddressId,
                    deliveryDate: new Date(deliveryDate).toISOString(),
                    notes: notes.trim() || undefined,
                }),
            })

            // Marca como enviado ANTES de atualizar o carrinho
            // pra desarmar a proteção de "carrinho vazio → volta pro /cart"
            setSubmitted(true)

            // Navega imediatamente — atualiza o carrinho depois, sem bloquear o redirect
            router.push(`/checkout/success?order=${order.id}`)

            // fire-and-forget: sincroniza o estado global do carrinho em background
            fetchCart()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao finalizar o pedido.')
            setSubmitting(false)
        }
    }

    if (authLoading || cartLoading || loadingAddresses) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    return (
        <>
            <div>
                <h1 className="font-serif text-3xl lg:text-4xl mb-10">Finalizar Pedido</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Coluna esquerda — formulário */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <CheckoutAddressStep
                            addresses={addresses}
                            selectedAddressId={selectedAddressId}
                            onSelectAddress={setSelectedAddressId}
                            onOpenNewAddress={() => setShowNewAddressModal(true)}
                        />

                        <CheckoutDetailsStep
                            deliveryDate={deliveryDate}
                            onChangeDeliveryDate={setDeliveryDate}
                            notes={notes}
                            onChangeNotes={setNotes}
                        />

                        {error && (
                            <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Coluna direita — resumo */}
                    <div className="lg:col-span-1">
                        <CheckoutSummary
                            cart={cart}
                            onConfirm={handleSubmit}
                            submitting={submitting}
                            canSubmit={!!selectedAddressId && !!deliveryDate}
                        />
                    </div>
                </div>
            </div>

            {showNewAddressModal && (
                <NewAddressModal
                    onClose={() => setShowNewAddressModal(false)}
                    onCreated={handleAddressCreated}
                />
            )}
        </>
    )
}