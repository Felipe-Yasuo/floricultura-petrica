import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta Pétrica para gerenciar pedidos, endereços e favoritos.",
  robots: { index: false },
}

export default function LoginPage() {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 px-6 lg:px-8 flex items-center justify-center min-h-screen">
                <AuthForm initialTab="login" />
            </main>
        </>
    )
}