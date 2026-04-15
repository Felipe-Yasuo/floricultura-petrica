import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartContent from '@/components/cart/CartContent'

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