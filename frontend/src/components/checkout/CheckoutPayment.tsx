'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Elements } from '@stripe/react-stripe-js'
import { StripeElementsOptions } from '@stripe/stripe-js'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { getStripe } from '@/lib/stripe'
import PaymentForm from './PaymentForm'
import { formatPrice } from '@/lib/utils'

interface PaymentData {
    clientSecret: string
    amount: number
    orderId: string
}

export default function CheckoutPayment() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get('order')

    const { token, isAuthenticated, isLoading: authLoading } = useAuth()

    const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login')
            return
        }

        if (!orderId) {
            setError('Pedido não especificado.')
            setLoading(false)
            return
        }

        if (isAuthenticated && token) {
            fetchPaymentData()
        }
    }, [isAuthenticated, authLoading, orderId, token])

    const fetchPaymentData = async () => {
        if (!token || !orderId) return

        setLoading(true)
        setError('')

        try {
            const data: PaymentData = await api(`/orders/${orderId}/payment`, { token })
            setPaymentData(data)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao carregar pagamento'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    if (error || !paymentData) {
        return (
            <div className="max-w-xl mx-auto text-center py-16 lg:py-24">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={40} className="text-red-600" />
                </div>

                <h1 className="font-serif text-3xl lg:text-4xl mb-4">Erro no Pagamento</h1>

                <p className="text-[var(--color-foreground-muted)] mb-8">
                    {error || 'Não foi possível carregar as informações de pagamento.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/cart"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:scale-[1.02] transition-all duration-300"
                    >
                        Voltar ao carrinho
                    </Link>
                    <Link
                        href="/account/orders"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--color-surface-container)] text-sm font-medium hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                    >
                        Ver meus pedidos
                    </Link>
                </div>
            </div>
        )
    }

    const options: StripeElementsOptions = {
        clientSecret: paymentData.clientSecret,
        appearance: {
            theme: 'flat',
            variables: {
                colorPrimary: '#1B4332',
                colorBackground: '#faf9f6',
                colorText: '#1A1A1A',
                colorDanger: '#ef4444',
                fontFamily: 'Inter, system-ui, sans-serif',
                borderRadius: '12px',
                spacingUnit: '4px',
            },
        },
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="font-serif text-3xl lg:text-4xl mb-3">Pagamento</h1>
            <p className="text-[var(--color-foreground-muted)] mb-10">
                Finalize seu pedido de forma segura. Total: <span className="font-medium text-[var(--color-foreground)]">{formatPrice(paymentData.amount)}</span>
            </p>

            <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient">
                <Elements stripe={getStripe()} options={options}>
                    <PaymentForm orderId={paymentData.orderId} amount={paymentData.amount} />
                </Elements>
            </div>
        </div>
    )
}