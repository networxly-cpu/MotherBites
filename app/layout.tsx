import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/language-context'
import { CartProvider } from '@/lib/cart-context'
import './globals.css'
import ChatBot from '@/components/chat-bot'
import AutoLogout from '@/components/auto-logout' // नवीन ॲड केलेली ओळ

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MotherBites - Authentic Village Food',
  description: 'Authentic homemade village food products. 100% natural, chemical-free. Handmade with love by village grandmothers.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-transparent w-full overflow-x-hidden">
      <body className="font-sans antialiased w-full overflow-x-hidden text-[#FEF5E7] bg-transparent">
        <LanguageProvider>
          <CartProvider>
            <AutoLogout /> {/* नवीन सिक्युरिटी लेअर */}
            {children}
            <ChatBot />
          </CartProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}