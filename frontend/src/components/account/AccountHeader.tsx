'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, MapPin, UserCircle, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const menuItems = [
    { label: 'Meus Pedidos', href: '/account', icon: Package },
    { label: 'Endereços', href: '/account/addresses', icon: MapPin },
    { label: 'Perfil', href: '/account/profile', icon: UserCircle },
]

export default function AccountHeader() {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    return (
        <div className="mb-10">
            <div className="rounded-3xl bg-[var(--color-surface-white)] shadow-ambient overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 lg:p-8 border-b border-[var(--color-surface-container)]">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                            <span className="text-[var(--color-on-primary)] font-serif text-xl">
                                {user?.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 className="font-serif text-xl">{user?.name}</h2>
                            <p className="text-sm text-[var(--color-foreground-muted)]">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-[var(--color-accent)] hover:bg-red-50 transition-all duration-300 self-start md:self-auto"
                    >
                        <LogOut size={16} />
                        Sair
                    </button>
                </div>

                <nav className="flex overflow-x-auto px-4 lg:px-6">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-300 ${isActive
                                    ? 'border-[var(--color-primary)] text-[var(--color-foreground)]'
                                    : 'border-transparent text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                                    }`}
                            >
                                <item.icon size={16} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}