'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Tag, ShoppingCart, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Produtos', href: '/admin/products', icon: Package },
    { label: 'Categorias', href: '/admin/categories', icon: Tag },
    { label: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, isAuthenticated, isLoading, logout } = useAuth()

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
            router.push('/login')
        }
    }, [isLoading, isAuthenticated, user])

    return (
        <aside className="w-64 bg-[var(--color-primary)] text-[var(--color-on-primary)] p-6 flex flex-col shrink-0">
            {/* Logo */}
            <Link href="/admin" className="font-serif text-2xl italic mb-2">
                Pétrica
            </Link>
            <span className="text-xs text-[rgba(255,255,255,0.4)] tracking-[0.15em] uppercase mb-10">
                Painel Admin
            </span>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 flex-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'bg-[rgba(255,255,255,0.15)] text-white'
                                    : 'text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom */}
            <div className="flex flex-col gap-1 pt-6 border-t border-[rgba(255,255,255,0.1)]">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-all duration-300"
                >
                    <ArrowLeft size={18} />
                    Voltar à Loja
                </Link>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-accent)] transition-all duration-300 w-full"
                >
                    <LogOut size={18} />
                    Sair
                </button>
            </div>
        </aside>
    )
}