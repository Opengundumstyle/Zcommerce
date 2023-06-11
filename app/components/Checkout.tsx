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
import {FiCopy} from "react-icons/fi";
import { AiFillQuestionCircle,AiOutlineInfoCircle,AiFillInfoCircle} from "react-icons/ai";


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
                    
                    <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 mt-5">
                         <div className="collapse-title text-md font-normal text-slate-600 flex flex-row items-center gap-2">
                           I want to test payment only 
                           <span><AiFillQuestionCircle className="text-teal-700 text-xl"/></span>
                         </div>
                         <div className="collapse-content"> 
                         <p>
                         <div className="text-xs">We got a demo card for you to use, so you can proceed with the payment :) Copy the below card number and paste it to card number section. Fill in the empty slots with <span className="font-semibold">ANY</span> number, then you are good to go! </div>
                         <div className="py-2 flex-row text-gray-500">
                          Card number:
                      <div onClick={() => {
                             navigator.clipboard.writeText('4242424242424242')
                             toast.success('Card number ready to use', {
                              position: "bottom-center"
                            })
                         }} 
                          className="cursor-pointer flex flex-row justify-center items-center gap-2 bg-slate-200 border-slate-200 rounded-sm py-1 hover:bg-slate-100 hover: transition-all duration-200 hover:text-teal-700">
                          <div className="text-gray-500">4242 424242 4242 4242</div>
                           <FiCopy/>
                         </div>
                         </div>

                          </p>
                         </div>
                         </div>

                         <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200">
                              <div className="collapse-title text-md font-semibold text-teal-700 flex flex-row items-center gap-2 ">
                                  Disclaimers
                                  <span><AiFillInfoCircle className="text-teal-700 text-lg text-bold"/></span>
                              </div>
                              <div className="collapse-content"> 
                              <div className="font-sans text-sm">
                              <h1 className= "font-normal">Privacy Policy for <span className="text-teal-700 font-lobster text-md">Zcommerce</span> </h1><br />

                                        <p>At zcommerce, accessible from <a href="https://zcommerce-silk.vercel.app" className="text-teal-700">zcommerce-silk.vercel.app</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by zcommerce and how we use it.</p>

                                        <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in zcommerce. This policy is not applicable to any information collected offline or via channels other than this website.</p><br />

                                        <h2 className="font-semibold ">Content:</h2>

                                        <p>The e-commerce store (zcommerce) displayed on this website is a demonstration store created solely for showcasing my full-stack development skills. The products listed on this site are sourced from other existing e-commerce websites for demonstration purposes only. This is not a real online store, and no actual transactions or purchases can be made. The purpose of this demo store is to showcase the functionality and features of a typical e-commerce website. Any resemblance to real products or brands is purely coincidental.</p><br />

                                        <h2 className="font-semibold ">Information the website collect:</h2>

                                        <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
                                        <p>When you register for an Account, we may ask for your contact information, including items such as name and email address.</p>

                                        <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact me @ <a className="text-teal-700">zhlin04@gmail.com</a></p>
                                   </div>
                              </div>
                         </div>
                         
                  </motion.div>
             )}
          </div>
     )

}