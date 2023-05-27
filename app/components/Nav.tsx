'use client'

import { Session } from "next-auth"
import {signIn} from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import Cart from "./Cart"
import useCartStore from "@/store"
import {AnimatePresence, motion} from 'framer-motion'

import {AiFillShopping} from 'react-icons/ai'

export default function Nav({user}:Session){
   
      console.log('what is the user',user)
      const cartstore = useCartStore()

      return (
          <nav className="flex justify-between items-center py-12">
            <Link href={'/'} >
              <h1>sexy brian</h1>
            </Link>
            <ul className="flex items-center gap-12">
                {/**if the user is not signed in */}
                <li 
                  onClick={()=>cartstore.toggleCart()}
                  className="flex items-center text-3xl cursor-pointer relative">
                 <AiFillShopping/>
                 {cartstore.cart.length > 0 && (
                  <AnimatePresence>
                    <motion.span 
                       animate={{scale:1}} 
                       initial={{scale:0}} 
                       exit={{scale:0}}
                       className="bg-teal-700 text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center">
                      {cartstore.cart.length}
                    </motion.span>
                  </AnimatePresence>
                )}

                </li>
                {!user && (
                  
                      <li className="bg-teal-600 text-white py-2 px-4 rounded-md">
                          <button onClick={()=>signIn()}>Sign in</button>
                      </li>
                  
                )}
                {
                  user && (
                  
                       <li>
                              <Image 
                                src={user?.image as string} 
                                alt={user.name as string} 
                                width={36} height={36}
                                className="rounded-full"
                                />
                       </li>
                    
                  )
                }
            </ul>
            <AnimatePresence>
              {cartstore.isOpen && <Cart/>}
            </AnimatePresence>
          </nav>
      )
}