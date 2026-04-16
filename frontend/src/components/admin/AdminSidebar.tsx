'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Tag, ShoppingCart, LogOut, ArrowLeft, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

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
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
            router.push('/login')
        }
    }, [isLoading, isAuthenticated, user])

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 h-16 flex items-center justify-between">
                <Link href="/admin" className="font-serif text-xl italic">
                    Pétrica Admin
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
                    className="p-2 rounded-xl hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Backdrop - mobile only */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 z-40 bg-black/50"
                />
            )}

            {/* Sidebar */}
            <aside className={`
        w-64 bg-[var(--color-primary)] text-[var(--color-on-primary)] p-6 flex flex-col shrink-0
        fixed lg:sticky top-0 left-0 h-screen z-50
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo - hidden on mobile (shown in mobile header) */}
                <Link href="/admin" className="font-serif text-2xl italic mb-2 hidden lg:block">
                    Pétrica
                </Link>
                <span className="text-xs text-[rgba(255,255,255,0.4)] tracking-[0.15em] uppercase mb-10 hidden lg:block">
                    Painel Admin
                </span>

                {/* Mobile spacer */}
                <div className="h-4 lg:hidden" />

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
        </>
    )
}