'use client'

import { useState,useEffect } from "react"
import { PaymentElement,useStripe,useElements } from "@stripe/react-stripe-js"
import formatPrice from "../util/PriceFormat"
import useCartStore from "@/store"
import FireAnimation from "./FireAnimation"

export default function CheckoutForm({clientSecret}:{clientSecret:string}){
    
     const stripe = useStripe()
     const elements = useElements()
     const [isLoading,setIsLoading] = useState(false)
     const cartStore = useCartStore()

     const [isHovered, setIsHovered] = useState(false);

     const totalPrice = cartStore.cart.reduce((acc,item)=>{
           return acc + item.unit_amount! * item.quantity!
     },0)
     const formattedPrice = formatPrice(totalPrice)

     useEffect(()=>{
          if(!stripe)return 
          if(!clientSecret) return

     },[stripe])
     
     const handleSubmit = async(e:React.FormEvent)=>{
         e.preventDefault()

         if(!stripe || !elements) return

          setIsLoading(true)
          stripe.confirmPayment({
              elements,
              redirect:'if_required'
          })
          .then((result)=>{

               cartStore.setPaymentIntent('')
     
               if(!result.error){
                 
                 cartStore.setCheckout("success")
               }
               setIsLoading(false)
          })
            
     }

     return(
         <form onSubmit={handleSubmit} id='payment-form' className="text-gray-600">
               <PaymentElement
                  id="payment-element"
                  options={{layout:'tabs'}}
               />
               <h2 className="py-4 text-sm font-bold">Total:{formattedPrice}</h2>
               <button 
                  className={`py-2 mt-4 w-full bg-teal-700 rounded-md text-white disabled:opacity-25`}
                  id="submit" disabled={isLoading || !stripe || !elements}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}>
                   <span id="button-text">
                      {isLoading? <span>Processing 👀</span> : <span className="flex flex-row justify-center items-center min-h-[30px]">Pay now {isHovered?<div className="text-lg "><FireAnimation/></div>:' '}</span>}
                   </span>
               </button>
         </form>
     )
}