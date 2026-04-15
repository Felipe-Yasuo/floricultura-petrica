import Navbar from '@/components/layout/Navbar'
import AuthForm from '@/components/auth/AuthForm'

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