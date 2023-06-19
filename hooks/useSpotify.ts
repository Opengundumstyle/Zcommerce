 
 
 import { useEffect} from "react"

 import spotifyApi from "@/lib/spotify"
import { Session } from "next-auth"
 
 function useSpotify(user:Session){
   
   
     useEffect(()=>{

          if(user){
               spotifyApi.setAccessToken(user.accesstoken )
          } 

         
        
     },[user])

     return spotifyApi

 
 } 


 export default useSpotify