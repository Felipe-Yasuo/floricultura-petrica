import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie sua conta Pétrica e comece a explorar nossa curadoria botânica.",
  robots: { index: false },
}

export default function RegisterPage() {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 px-6 lg:px-8 flex items-center justify-center min-h-screen">
                <AuthForm initialTab="register" />
            </main>
        </>
    )
}