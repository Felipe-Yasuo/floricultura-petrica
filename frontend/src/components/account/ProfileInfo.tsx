'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilePage() {
    const router = useRouter()
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [authLoading, isAuthenticated])

    if (authLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    return (
        <div>
            <h1 className="font-serif text-2xl lg:text-3xl mb-8">Meu Perfil</h1>

            <div className="max-w-2xl">
                <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                            <span className="text-[var(--color-on-primary)] font-serif text-2xl">
                                {user?.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 className="font-serif text-xl">{user?.name}</h2>
                            <p className="text-sm text-[var(--color-foreground-muted)]">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] mb-2">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={user?.name || ''}
                                disabled
                                className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm text-[var(--color-foreground)] outline-none opacity-70"
                            />
                        </div>
                        <div>
                            <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm text-[var(--color-foreground)] outline-none opacity-70"
                            />
                        </div>
                        <div>
                            <label className="block text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] mb-2">
                                Tipo de Conta
                            </label>
                            <input
                                type="text"
                                value={user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                                disabled
                                className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm text-[var(--color-foreground)] outline-none opacity-70"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}