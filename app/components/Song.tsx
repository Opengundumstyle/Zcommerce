
'use client'
import { useState } from "react";
import { BsFillPlayFill,BsFillPauseFill } from "react-icons/bs";
import usePlayer from "@/hooks/usePlayer";
import MusicPlayingAnimation from "./MusicPlayingAnimation";

const Song = ({song,index,webPlayer,spodify,current_track,playlistId}) => {
  
 
  


  const [onHovered, setOnHovered] = useState(false);

  const player = usePlayer()



  const playSongInPlaylist = async () => {

    const url = `https://api.spotify.com/v1/me/player/play`;
    
  
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${spodify.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       context_uri:`spotify:playlist:${playlistId}`,
        offset:{
           position:index
        }
      }),
    });
  
    if (response.status === 204) {
      console.log('Playback started');
    } else {
      console.error('Failed to start playback');
    }


  };




  const handlePlay = ()=>{

   
          current_track.id === song.id?  webPlayer.togglePlay():playlistId?playSongInPlaylist():spodify.play({uris:[song.uri]})
             
           if(!player.isPlaying){ 
             player.setIsPlaying(true)
            }else{
              player.setIsPlaying(false)
            }
            
           !playlistId && player.setIsLikedPlaylist(true)

  }


  return (
    <div
      key={index}
      className={`flex items-center gap-2 cursor-pointer rounded-md py-2 ${
        onHovered|| current_track.id === song.id && player.isPlaying ? " bg-gray-500 bg-opacity-80" : ""
      }`}
      onMouseEnter={() => setOnHovered(true)}
      onMouseLeave={() => setOnHovered(false)}
      onClick={handlePlay}
    >
      <div className={`w-8 text-center ${onHovered && 'text-black'}`}>{current_track.id === song.id && player.isPlaying?<MusicPlayingAnimation/>: index + 1}</div>
      <div className="relative">
        <img
          className={`w-10 h-10 object-cover ${onHovered ? "opacity-50" : ""}`}
          src={song.image}
          alt={song.name}
        />
        {onHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            {current_track.id === song.id && player.isPlaying?<BsFillPauseFill className="text-white text-2xl" />:<BsFillPlayFill className="text-white text-2xl" />}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold">{song.name}</h3>
        <p className={`text-sm text-gray-500 ${onHovered && 'text-white opacity-100'}`}>{song.artists}</p>
      </div>
    </div>
  );
};

export default Song;