import './globals.css'
import Nav from './components/Nav'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Hydrate from './components/Hydrate'
import {Roboto,Lobster_Two} from 'next/font/google'
import ToasterProvider from './providers/Toasterprovider'
import MusicPlayer from './components/MusicPlayer'

// Define main font
const roboto = Roboto({weight:['400','500','700'],subsets:['latin'],variable:'--font-roboto'})
const lobster = Lobster_Two({weight:'700',subsets:['latin'],variable:'--font-lobster'})

export const metadata = {
  title: 'Zcommerce',
  description: 'Your fashion partner',
  icons: {
    icon: '/public/zcommercelogo.png'
  }
}

export default async function RootLayout({
  children,

}: {
  children: React.ReactNode,

}) {

  // Fetch the user
  const session = await getServerSession(authOptions)




  
return (
    <html lang="en" className={`${roboto.variable} ${lobster.variable}`}>
     
        <Hydrate>
             
              <ToasterProvider/>
              <Nav user={session?.user} expires={session?.expires as string} />
              <div className='flex flex-row justify-evenly items-center'>
                  <MusicPlayer/>
                  <div className='flex-grow'>
                  {children}
                  </div>
              </div>

        </Hydrate>
       
       
    </html>
  )
}
