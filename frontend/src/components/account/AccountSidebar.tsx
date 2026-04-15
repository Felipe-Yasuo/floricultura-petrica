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

export default function AccountSidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    return (
        <aside className="lg:w-56 shrink-0">
            {/* User Info */}
            <div className="mb-8">
                <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] flex items-center justify-center mb-3">
                    <span className="text-[var(--color-on-primary)] font-serif text-xl">
                        {user?.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <h2 className="font-serif text-lg">{user?.name}</h2>
                <p className="text-xs text-[var(--color-foreground-muted)]">{user?.email}</p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${isActive
                                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                                    : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-container)]'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    )
                })}

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-[var(--color-accent)] hover:bg-red-50 transition-all duration-300 whitespace-nowrap"
                >
                    <LogOut size={18} />
                    Sair
                </button>
            </nav>
        </aside>
    )
}