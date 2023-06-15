import { Song } from "@/types/SongType"
import { useState,useEffect, useMemo } from "react"
import supabase from "@/app/util/supabaseClient"
import { toast } from "react-hot-toast"
import usePlayer from "./usePlayer"

const useGetSongById = (id?:string)=>{

     const [isLoading,setIsLoading] = useState(false)
     const [song,setSong] = useState<Song | undefined>(undefined)
     const player = usePlayer()

     useEffect(()=>{

     let fetchSong;

        if(!id ){

            if(!player.isPlaying)return 

            fetchSong = async()=>{
               const {data,error} = await supabase.from('songs').select("*").eq('id','1').single()

               setIsLoading(true)
  
               if(error){
                     setIsLoading(false)
                     return toast.error(error.message)
               }
  
               setSong(data as Song)
               setIsLoading(false)
             }

             
 
          }else{
            fetchSong = async()=>{
               const {data,error} = await supabase.from('songs').select("*").eq('id',id).single()

               setIsLoading(true)
  
               if(error){
                     setIsLoading(false)
                     return toast.error(error.message)
               }
  
               setSong(data as Song)
               setIsLoading(false)
             }  
          }
            
         fetchSong()
        


     },[id,supabase])


    return useMemo(()=>({
       isLoading,
       song
    }),[isLoading,song])

}

export default useGetSongById