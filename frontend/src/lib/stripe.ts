import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

export function getStripe() {
    if (!stripePromise) {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

        if (!publishableKey) {
            throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não configurada')
        }

        stripePromise = loadStripe(publishableKey)
    }

    return stripePromise
}