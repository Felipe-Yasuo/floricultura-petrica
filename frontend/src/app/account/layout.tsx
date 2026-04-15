import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AccountSidebar from '@/components/account/AccountSidebar'

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-10">
                    <AccountSidebar />
                    <div className="flex-1">{children}</div>
                </div>
            </main>
            <Footer />
        </>
    )
}