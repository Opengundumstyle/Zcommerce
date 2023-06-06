
import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/app/util/prisma"
import Stripe from "stripe";
import { hash } from "bcrypt";

export default async function handler(req: NextApiRequest,res: NextApiResponse){

      const stripe = new Stripe(process.env.STRIPE_SECRET as string,{
            apiVersion:'2022-11-15'
       })
   
      // only post method 
      if(req.method === 'POST'){

             if(!req.body)return res.status(404).json({error:"Don't have form data...!"})
             const {name,email,password} = req.body

             // check duplicate users 
             const checkexisting = await prisma.user.findUnique({
                    where:{email:email}
             })

             if(checkexisting){
                   return res.status(422).json({message:'User has already exists'})
             }else{

                  try {
                        const stripeCustomer  = await stripe.customers.create({
                               email,
                               name
                        })

                        const user = await prisma.user.create({
                          data: {
                            name,
                            email,
                            password: await hash(password, 12),
                            stripeCustomerId:stripeCustomer.id
                          },
                        });
                         

                        return res.status(200).json({ message: 'User created successfully', user });
                      } catch (error) {
                        return res.status(500).json({ error: 'Failed to create user'});
                      }
             }    

      }else{
             res.status(500).json({message:"HTTP method not valid only POST Accepted"})
      }

}