'use client'

import CheckoutForm from "./CheckoutForm"
import { loadStripe,StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import useCartStore from "@/store"
import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import OrderAnimation from "./OrderAnimation"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { useSession } from "@/store"



const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STIPE_PUBLIC_KEY!)

export default function Checkout(){
     const cartStore = useCartStore()
     const session = useSession()
     const router = useRouter()
     const [clientSecret,setClientSecret]= useState("")

     useEffect(()=>{
           //Create a payment intend
           fetch('/api/create-payment-intent',{
               method:"POST",
               headers:{'Content-Type':'application/json'},
               body:JSON.stringify({
                   items:cartStore.cart,
                   payment_intent_id:cartStore.paymentIntent,
               })
           }).then((res)=>{
            if(res.status === 403){
               if(session.isSession === false) session.toggleSession()
               cartStore.toggleCart()
               cartStore.setCheckout('cart')
               toast('Sign in to proceed', {
                    icon: '🫡',
                  });
                  return router.push('/auth')
            }else{
               return res.json()
             }
           }).then((data)=>{
              if(!data) return
               setClientSecret(data.paymentIntent.client_secret) 
               cartStore.setPaymentIntent(data.paymentIntent.id)
           })
     },[])

  
    const options:StripeElementsOptions = {
         clientSecret,
         appearance:{
             theme:'stripe',
             labels:'floating',
         }
    }

     return(
          <div>
             {!clientSecret && <OrderAnimation/>}
             {clientSecret && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <Elements options={options} stripe={stripePromise}>
                         <CheckoutForm clientSecret={clientSecret}/>
                    </Elements>
                  </motion.div>
             )}
          </div>
     )

}