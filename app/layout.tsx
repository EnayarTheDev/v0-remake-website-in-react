import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'ReBook - Buy & Sell School Textbooks',
  description: 'ReBook is a simple and affordable platform to buy and sell school textbooks online. Multi-language support (French, English, Arabic).',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
