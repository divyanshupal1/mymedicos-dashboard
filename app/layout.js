import { Inter } from 'next/font/google'
import './globals.css'

import { ThemeProvider } from "@/components/theme-provider"
import ToastProvider from '@/components/toastProvider'



const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'myMedicos - Dashboard',
  description: 'myMedicos - Dashboard',
}

export default function RootLayout({ children,session }) {
  return (
    <html lang="en">      
      <body className={inter.className}>

      <ThemeProvider attribute="class" defaultTheme="system">
        <ToastProvider/>
          {children}
        </ThemeProvider>

      </body>
    </html>
  )
}
