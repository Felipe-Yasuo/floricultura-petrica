import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartContent from '@/components/cart/CartContent'

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Revise os itens do seu carrinho antes de finalizar o pedido.",
  robots: { index: false },
}

export default function CartPage() {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <CartContent />
            </main>
            <Footer />
        </>
    )
}