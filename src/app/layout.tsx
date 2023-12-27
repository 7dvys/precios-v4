import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Nav } from '@/components/Nav'
import { NotificationStack } from '@/components/NotificationsStack'
import { ContabiliumProvider } from '@/providers/ContabiliumProvider'
import { getTokensFromCookies } from '@/utils/contabilium/getTokens'

export const metadata: Metadata = {
  title: 'Gautama',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const tokens = getTokensFromCookies();
  
  return (
    <html lang="es">
      <body>
        <Nav/>
        <div className='rootContainer'>
          <ContabiliumProvider tokens={tokens}>{children}</ContabiliumProvider>
          <NotificationStack/>
        </div>
      </body>
    </html>
  )
}

