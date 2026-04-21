import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AccountHeader from '@/components/account/AccountHeader'

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <AccountHeader />
                    <div>{children}</div>
                </div>
            </main>
            <Footer />
        </>
    )
}