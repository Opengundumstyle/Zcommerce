import { Session } from "next-auth"
import useSpotify from "./useSpotify"
import { useState,useEffect } from "react"
import usePlayer from "./usePlayer"

function useSongInfo(user:Session) {
  
  const spotifyApi = useSpotify(user)
  const [songInfo,setSongInfo] = useState(null)
  const player = usePlayer()

  useEffect(()=>{

       const fetchSongInfo = async()=>{ 
            if(player.activeId && player.uri){
                  const trackInfo = await fetch(
                       `https://api.spotify.com/v1/tracks/${player.activeId}`,
                       {
                         headers:{
                             Authorization:`Bearer ${spotifyApi.getAccessToken()}`
                         }
                       }
                  ).then(res=>res.json())

                  setSongInfo(trackInfo)
            }
             
       }
       fetchSongInfo()

  },[player.activeId,spotifyApi])

  return songInfo
     
}

export default useSongInfo
