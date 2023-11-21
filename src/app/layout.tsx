import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Nav } from '@/components/Nav'
import { NotificationStack } from '@/components/NotificationsStack'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gautama',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Nav/>
        <div className='rootContainer'>
          {children}
          <NotificationStack/>
        </div>
      </body>
    </html>
  )
}

