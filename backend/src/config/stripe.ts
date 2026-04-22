import Stripe from 'stripe'
import { env } from './env'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
    typescript: true,
    appInfo: {
        name: 'Petrica',
        version: '1.0.0',
    },
})

export const STRIPE_CURRENCY = 'brl'