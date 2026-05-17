import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import SearchOverlay from '@/components/search/SearchOverlay'
import InitStore from '@/components/InitStore'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EXPENDABLES - Premium Sri Lankan Lifestyle Fashion',
  description: 'Discover premium T-shirts for men, women, and unisex. Streetwear, oversized, graphic tees, and more from Sri Lanka\'s lifestyle fashion brand.',
  keywords: 'T-shirts, Sri Lanka fashion, streetwear, oversized tees, graphic tees, premium cotton',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" />
        <InitStore />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <SearchOverlay />
      </body>
    </html>
  )
}
