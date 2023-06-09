import NextAuth, { NextAuthOptions }  from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github"
import SpotifyProvider from "next-auth/providers/spotify"
import CredentialsProvider  from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/util/prisma";
import Stripe from "stripe";
import * as bcrypt from 'bcrypt'
import spotifyApi,{ LOGIN_URL } from "@/lib/spotify";
import { JWT } from "next-auth/jwt";


async function refreshAccessToken(token: JWT){

   try{
       spotifyApi.setAccessToken(token.accessToken);
       spotifyApi.setRefreshToken(token.refreshToken);

       const {body:refreshedToken} = await spotifyApi.refreshAccessToken()

       return {
          ...token,
          accessToken:refreshedToken.access_token,
          // accessTokenExpires:Date.now()+ refreshedToken.expires_in * 1000,
          refreshedToken:refreshedToken.refresh_token??token.refreshToken

       }
     
   }catch(error){
       console.log(error)

       return{
          ...token,
          error:'RefreshAccessTokenError'
       }
   }
}





export const authOptions:NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret:process.env.NEXT_AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string, 
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_SECRET as string, 
      authorization:LOGIN_URL
    }),
    CredentialsProvider({
       name:"Credentials",
       credentials:{
         email:{label:"email",type:"text"},
         password:{label:"password",type:"password"},
    },
       async authorize(credentials){
    
         if(!credentials?.email || !credentials.password){
            throw new Error('invalid credentials')
        }

        const user = await prisma.user.findUnique({
           where:{
               email:credentials.email
           }
        })
          if(!user || !user?.password){
              throw new Error('Invalid Credentials')
          }

        const isCorrectPassword = await bcrypt.compare(
             credentials.password,
             user.password
         )

       if(!isCorrectPassword){
           throw new Error('Invalid Credentials')
       }

       return user
       }
    })
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

   pages:{
      signIn:'/',
   },
   callbacks: {
      session: async ({ session, token }) => {
        if (session?.user) {
          session.user.id = token.uid;
          session.user.accesstoken= token.accessToken
        }
        return session;
      },
      jwt: async ({ user,token,account }) => {
        if (user) {
          token.uid = user.id;
          token.accessToken= account?.access_token
        }
        return token;
      },
    },
    
   session: {
      strategy: "jwt",
      maxAge: 3000,
   },

};



const nextAuthHandler = NextAuth(authOptions);

export default nextAuthHandler