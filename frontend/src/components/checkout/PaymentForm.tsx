'use client'

import { useState, FormEvent } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Loader2, Lock, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface PaymentFormProps {
    orderId: string
    amount: number
}

export default function PaymentForm({ orderId, amount }: PaymentFormProps) {
    const stripe = useStripe()
    const elements = useElements()

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) return

        setSubmitting(true)
        setError(null)

        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success?order=${orderId}`,
            },
        })

        if (stripeError) {
            if (stripeError.type === 'card_error' || stripeError.type === 'validation_error') {
                setError(stripeError.message ?? 'Erro ao processar pagamento.')
            } else {
                setError('Erro inesperado. Tente novamente ou use outro cartão.')
            }
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <PaymentElement
                options={{
                    layout: 'tabs',
                }}
            />

            {error && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 text-red-700 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || !elements || submitting}
                className="group w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                {submitting ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Processando...
                    </>
                ) : (
                    <>
                        <Lock size={16} />
                        Pagar {formatPrice(amount)}
                    </>
                )}
            </button>

            <p className="text-xs text-[var(--color-foreground-subtle)] text-center flex items-center justify-center gap-1.5">
                <Lock size={12} />
                Pagamento processado pela Stripe. Seus dados estão seguros.
            </p>
        </form>
    )
}