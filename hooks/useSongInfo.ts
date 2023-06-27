

import { useState,useEffect } from "react"
import SpotifyWebApi from "spotify-web-api-node"
import usePlayer from '@/hooks/usePlayer'

function useSongInfo(spotify:SpotifyWebApi,songId:string,action:string) {
  
  
  const [songInfo,setSongInfo] = useState()

  const player = usePlayer()

 

  const getPrevSongId = ()=>{
     const currentSongIndex= player.favIds.indexOf(songId)

    const previousSongIndex = (currentSongIndex - 1 >= 0?currentSongIndex - 1 : player.favIds.length - 1)
    const previousId = player.favIds[previousSongIndex]
   
    return previousId
}
  
  const getNextSongId = ()=>{
     const currentSongIndex= player.favIds.indexOf(songId)
     const nextSongIndex = currentSongIndex + 1 <= player.favIds.length?currentSongIndex + 1 : 0
     const nextId = player.favIds[nextSongIndex]


     return nextId
 }




   useEffect(()=>{

       if(!player.isLikedPlaylist || !songId) return 

       let id = (action === 'prev')? getPrevSongId():getNextSongId()
      
       const fetchSongInfo = async()=>{ 
         
                  const trackInfo = await fetch(
                       `https://api.spotify.com/v1/tracks/${id}`,
                       {
                         headers:{
                             Authorization:`Bearer ${spotify.getAccessToken()}`
                         }
                       }
                  ).then(res=>res.json())

                  setSongInfo(trackInfo)
          
                    }
     
     fetchSongInfo()


     } ,[songId])



  return songInfo
     
}

export default useSongInfo
