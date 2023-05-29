import NextAuth, { NextAuthOptions }  from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/util/prisma";
import Stripe from "stripe";



export const authOptions:NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret:process.env.NEXT_AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  events:{
     createUser: async({user})=>{
         const stripe = new Stripe(process.env.STRIPE_SECRET as string,{
              apiVersion:'2022-11-15'
         })
         if(user.name && user.email){
          const customer = await stripe.customers.create({
             email:user.email || undefined,
             name:user.name || undefined,
         })
         //also update our prisma user with the stripecusomterid
            
            await prisma.user.update({
                 where:{id:user.id},
                 data:{stripeCustomerId:customer.id}
            })
        }
     }
  },
  callbacks:{
     async session({session,token,user}){
          session.user  = user
          await prisma.$disconnect();
          return session
     }
  }
  
};


const nextAuthHandler = NextAuth(authOptions);

export default nextAuthHandler;
