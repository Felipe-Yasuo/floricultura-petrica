'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { user, isAuthenticated, logout } = useAuth()

    const { itemCount } = useCart()

    return (
        <nav className="fixed top-4 left-4 right-4 z-50 h-[68px] flex items-center justify-between px-6 lg:px-8 rounded-3xl bg-[rgba(255,255,255,0.4)] backdrop-blur-md border border-[rgba(255,255,255,0.32)] shadow-layered">
            {/* Logo - Left */}
            <Link
                href="/"
                className="font-serif text-2xl italic text-[var(--color-foreground)]"
            >
                Pétrica
            </Link>

            {/* Links - Center */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                <Link
                    href="/shop"
                    className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors duration-300"
                >
                    Shop
                </Link>
                <Link
                    href="/shop?category=bouquets"
                    className="text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors duration-300"
                >
                    Bouquets
                </Link>
                <Link
                    href="/about"
                    className="text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors duration-300"
                >
                    Sobre
                </Link>
            </div>

            {/* Icons - Right */}
            <div className="hidden md:flex items-center gap-3">
                <button
                    aria-label="Buscar"
                    className="p-2 rounded-full hover:bg-[var(--color-surface-container)] transition-colors duration-300"
                >
                    <Search size={20} className="text-[var(--color-foreground)]" />
                </button>
                <Link
                    href="/cart"
                    aria-label="Carrinho"
                    className="p-2 rounded-full hover:bg-[var(--color-surface-container)] transition-colors duration-300 relative"
                >
                    <ShoppingBag size={20} className="text-[var(--color-foreground)]" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-accent)] text-white text-xs flex items-center justify-center font-medium">
                            {itemCount}
                        </span>
                    )}
                </Link>

                {isAuthenticated ? (
                    <div className="flex items-center gap-2 ml-2">
                        {user?.role === 'ADMIN' && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:scale-[1.02] transition-all duration-300"
                            >
                                <LayoutDashboard size={16} />
                                <span className="text-sm font-medium">Admin</span>
                            </Link>
                        )}
                        <Link
                            href="/account"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                        >
                            <User size={16} className="text-[var(--color-primary)]" />
                            <span className="text-sm font-medium text-[var(--color-foreground)]">
                                {user?.name.split(' ')[0]}
                            </span>
                        </Link>
                        <button
                            onClick={logout}
                            aria-label="Sair"
                            className="p-2 rounded-full hover:bg-[var(--color-surface-container)] transition-colors duration-300"
                        >
                            <LogOut size={18} className="text-[var(--color-foreground-muted)]" />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="ml-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:scale-[1.02] transition-all duration-300"
                    >
                        Entrar
                    </Link>
                )}
            </div>

            {/* Mobile - Hamburger */}
            <div className="md:hidden flex items-center gap-3">
                <Link
                    href="/cart"
                    aria-label="Carrinho"
                    className="p-2 rounded-full"
                >
                    <ShoppingBag size={20} className="text-[var(--color-foreground)]" />
                </Link>
                <button
                    aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full"
                >
                    {isOpen ? (
                        <X size={22} className="text-[var(--color-foreground)]" />
                    ) : (
                        <Menu size={22} className="text-[var(--color-foreground)]" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`absolute top-full left-0 right-0 mt-2 rounded-3xl bg-[rgba(255,255,255,0.85)] backdrop-blur-md border border-[rgba(255,255,255,0.32)] shadow-layered overflow-hidden transition-all duration-300 ease-out md:hidden ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 border-transparent'
                    }`}
            >
                <div className="flex flex-col p-6 gap-4">
                    <Link
                        href="/shop"
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        Shop
                    </Link>
                    <Link
                        href="/shop?category=bouquets"
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        Bouquets
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        Sobre
                    </Link>

                    <div className="border-t border-[var(--color-surface-container-high)] pt-4 mt-2">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-3">
                                {user?.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="text-base font-medium text-[var(--color-primary)]"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    href="/account"
                                    onClick={() => setIsOpen(false)}
                                    className="text-base font-medium text-[var(--color-foreground)]"
                                >
                                    Minha Conta
                                </Link>
                                <button
                                    onClick={() => { logout(); setIsOpen(false) }}
                                    className="text-base font-medium text-[var(--color-accent)] text-left"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block text-center px-6 py-3 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}