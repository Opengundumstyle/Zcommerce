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
        console.log('what is session',session)
        console.log('what is token',token)
        if (session?.user) {
          session.user.id = token.uid;
          session.user.accesstoken= token.accessToken
        }
        return session;
      },
      jwt: async ({ user,token,account }) => {
        console.log('what is jwt tooken',token)
        console.log('what is user ',user)
        console.log('what is account ',account)
        if (user) {
          token.uid = user.id;
          token.accessToken= account?.access_token
        }
        return token;
      },
    },
    // callbacks:{
        //  async jwt({user,token,account}){
        //   console.log('do i have account',account)
        //   console.log('do i have user',user)
        //   console.log('do i have token',token)
     
        //   if(account && user){
        //     console.log('do i have account',account)
        //     console.log('do i have user',user)
        //     console.log('do i have token',token)
        //     return{
        //        ...token,
        //        accessToken:account.access_token,
        //        refreshToken:account.refresh_token,
        //       //  uid:user.id,
        //        username:account.providerAccountId,
        //       //  accessTokenExpires:account.expires_at * 1000
               
        //     }
        //  }
        //  //return previous token if access token has not expires yet
        //     if(Date.now()){
        //       console.log("EXISTING TOKEN IS VALID")
        //         return token
        //     }

        //   // if access token is expired, refresh it.
        //   console.log("ACCESS TOKEN IS EXPIRED")
        //   return await refreshAccessToken(token)
        //  },
    //     async jwt({ token, account, user }) {
    //       // Persist the OAuth access_token and or the user id to the token right after signin
    //       console.log('do i have token jwt',token)
    //       console.log('do i have account',account)
    //       console.log('do i have user',user)
    //       if (account) {
    //         token.accessToken = account.access_token
    //         token.uid = user.id;
    //       }
    //       return token
    //     },

    //      async session({ session,token }) {
            
    //       console.log('Tokendog:', token);
    //       console.log('Session:', session);
    //       if (session?.user) {
    //         session.user.accessToken = token.accessToken
    //         session.user.refreshToken = token.refreshToken
    //         session.user.username = token.username
    //       }

    //         return session
    //     },
    //  }
    
   session: {
      strategy: "jwt",
      maxAge: 3000,
   },

};



const nextAuthHandler = NextAuth(authOptions);

export default nextAuthHandler