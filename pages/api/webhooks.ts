import Stripe from "stripe";
import { prisma } from "@/app/util/prisma";
import {buffer} from 'micro'
import { NextApiRequest,NextApiResponse } from "next";

export const config={ 
       api:{
         bodyParser:false
       }
}

const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
    apiVersion: "2022-11-15",
  })
  

  export default async function hander(req:NextApiRequest,res:NextApiResponse){
         const buf = await buffer(req)
         const sig = req.headers['stripe-signature']

         if(!sig){
              return res.status(400).send('Missing the Stripe Signature')
         }

         let event:Stripe.Event

         try{
            event  = stripe.webhooks.constructEvent(
                   buf,
                   sig,
                   process.env.STRIPE_WEBHOOK_SECRET!
            )
               
         }catch(error){
             return res.status(400).send('Webhook error' + error)
         }

           // handle different type of event

        switch(event.type){
            case "payment_intent.created":
                const paymentIntent = event.data.object
                console.log("payment intent was created")
                break
            case "charge.succeeded":
                const charge = event.data.object as Stripe.Charge
                if(typeof charge.payment_intent === 'string'){
                      const order  = await prisma.order.update({
                          where: { paymentIntentID: charge.payment_intent },
                          data: {status:"complete"}
                      })
                }
                break
            default:
                console.log('unhandle event type:' + event.type)

        }

         res.json({received:true})

  }



