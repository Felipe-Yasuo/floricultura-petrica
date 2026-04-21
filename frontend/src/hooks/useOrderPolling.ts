'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { Order } from '@/types/order'

type PollingState =
    | { status: 'loading'; order: null }
    | { status: 'processing'; order: Order }
    | { status: 'done'; order: Order }
    | { status: 'timeout'; order: Order | null }
    | { status: 'error'; order: null; message: string }

const POLLING_INTERVALS_MS = [1000, 2000, 4000, 8000]
const TIMEOUT_MS = 20000

export function useOrderPolling(orderId: string | null) {
    const { token, isAuthenticated } = useAuth()
    const [state, setState] = useState<PollingState>({ status: 'loading', order: null })

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const abortedRef = useRef(false)

    useEffect(() => {
        if (!orderId || !isAuthenticated || !token) return

        abortedRef.current = false
        const startedAt = Date.now()
        let attempt = 0

        const poll = async () => {
            if (abortedRef.current) return

            try {
                const order: Order = await api(`/orders/${orderId}`, { token })

                if (abortedRef.current) return

                if (order.status !== 'AWAITING_PAYMENT') {
                    setState({ status: 'done', order })
                    return
                }

                setState({ status: 'processing', order })

                const elapsed = Date.now() - startedAt
                if (elapsed >= TIMEOUT_MS) {
                    setState({ status: 'timeout', order })
                    return
                }

                const interval = POLLING_INTERVALS_MS[attempt] ?? POLLING_INTERVALS_MS[POLLING_INTERVALS_MS.length - 1]!
                attempt++

                timeoutRef.current = setTimeout(poll, interval)
            } catch (err) {
                if (abortedRef.current) return
                const message = err instanceof Error ? err.message : 'Erro ao consultar pedido'
                setState({ status: 'error', order: null, message })
            }
        }

        poll()

        return () => {
            abortedRef.current = true
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [orderId, isAuthenticated, token])

    return state
}