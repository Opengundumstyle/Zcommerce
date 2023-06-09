'use client'

import Image from "next/image"
import useCartStore from "@/store"
import { useSession } from "@/store"
import formatPrice from "../util/PriceFormat"

import {IoAddCircle, IoRemoveCircle } from 'react-icons/io5'
import basket from '@/public/shopping-basket.png'

import { AnimatePresence, motion } from "framer-motion"
import Checkout from "./Checkout"
import OrderConfirmed from "./OrderConfirmed"

import { useState } from "react"


export default function Cart({user}:any){

      const cartStore  = useCartStore()
      const sessionStore = useSession()
      console.log('what is the sessionStore',sessionStore)
      const [isHovered, setIsHovered] = useState(false);

      //total price
      const totalPrice  = cartStore.cart.reduce((acc,item)=>{
               return acc + item.unit_amount! * item.quantity!
      },0)
      
      return (
         <motion.div 
              initial={{opacity:0}}
              animate={{opacity:1}}
              exit={{opacity:0}}
              onClick={()=>cartStore.toggleCart()}
              className="fixed w-full h-screen left-0 top-0 bg-black/25 ">
            {/** Cart */}
            <motion.div  
                layout
                onClick={(e)=>e.stopPropagation()}
                className="bg-base-200 absolute right-0 top-0 h-screen p-12 overflow-y-scroll w-full lg:w-2/5">
                  
                  {cartStore.onCheckout === 'cart' && (
                  <div className="flex flex-row items-baseline">
                  <button onClick={()=>cartStore.toggleCart()} className="text-sm font-bold pb-12 ">Back to Store</button>
                  {cartStore.cart.length > 0 && <h1 className="flex-1 text-center text-lg font-serif">Shopping List <br/><div className="hidden lg:block">👨🏻‍💻</div></h1>}
                 </div>
                 )}
                  {cartStore.onCheckout === 'checkout' && (
                     <button onClick={()=>cartStore.setCheckout('cart')} className="text-sm font-bold pb-12 mr-2">Check your cart &nbsp;  🛒</button>
                 )}


                 {cartStore.onCheckout === 'cart' && (
                  <>
                 {cartStore.cart.map((item)=>(
                       <motion.div layout key={item.id} className="flex p-4 gap-4 bg-base-100 my-4 rounded-lg">
                            <Image className="rounded-md h-full w-24 object-cover" src={item.image} alt={item.name} width={150} height={150} />
                            <div>
                                <h2>{item.name}</h2>

                                <div className="flex gap-2">
                                <h2>Quantity: {item.quantity}</h2>
                                <button onClick={()=>cartStore.removeProduct({
                                        id:item.id,
                                        image:item.image,
                                        name:item.name,
                                        unit_amount:item.unit_amount,
                                        quantity:item.quantity
                                } 
                                       
                                )}><IoRemoveCircle/></button>
                                <button onClick={()=>cartStore.addProduct({
                                        id:item.id,
                                        image:item.image,
                                        name:item.name,
                                        unit_amount:item.unit_amount,
                                        quantity:item.quantity
                                })}><IoAddCircle/></button>
                                </div>

                                <p className="text-sm">{item.unit_amount && formatPrice(item.unit_amount)}</p>
                            </div>
                         </motion.div>
                       ))}
                   </>
                 )}
                 {/**Check out and total */}
                 {cartStore.cart.length > 0 && cartStore.onCheckout === 'cart'? (

                 
                 <motion.div  layout >
                        
                    <p>Total:{formatPrice(totalPrice)}</p>
                    <div  
                       onMouseEnter={() => setIsHovered(true)}  
                       onMouseLeave={() => setIsHovered(false)}>
                     <button 
                     onClick={()=>cartStore.setCheckout('checkout')}
                     className="py-2 mt-4 bg-teal-700 w-full rounded-md text-white "
                     disabled={sessionStore.isSession}
                     >
                     Check Out
                    </button>
                    </div>
                 </motion.div>):null}

                  {isHovered && !user && sessionStore.isSession && <div className="pt-5 text-gray-400">Sign in ... You're so closeee</div>}

                 {/** check out form */}
                 {cartStore.onCheckout === 'success' && <OrderConfirmed/>}
                 {cartStore.onCheckout === 'checkout' && <Checkout/>}
                 <AnimatePresence>
                 {!cartStore.cart.length && cartStore.onCheckout === 'cart' && ( 
                       <motion.div 
                             animate={{scale:1,rotateZ:0,opacity:0.75}} 
                             initial={{scale:0.5,rotateZ:-10,opacity:0}}
                             exit={{scale:0.5,rotateZ:-10,opacity:0}}
                             className="flex flex-col items-center gap-12 text-2xl fonr-medium pt-56 opacity-75">
                             <h1>Uhh ohhh...it's empty 😅</h1>
                             <Image src={basket} alt="empty cart" width={200} height={200}/>
                       </motion.div>
                 )}
                 </AnimatePresence>
            </motion.div>
         </motion.div>
      )
}