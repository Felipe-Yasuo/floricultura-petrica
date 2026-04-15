import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import Products from '@/components/sections/Products'
import Testimonials from '@/components/sections/Testimonials'
import Newsletter from '@/components/sections/Newsletter'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Products />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  )
}