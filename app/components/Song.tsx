
'use client'
import { useState } from "react";
import { BsFillPlayFill,BsFillPauseFill } from "react-icons/bs";
import usePlayer from "@/hooks/usePlayer";
import MusicPlayingAnimation from "./MusicPlayingAnimation";

const Song = ({song,index,webPlayer,spodify,current_track}) => {
  

  
  const [onHovered, setOnHovered] = useState(false);

  const player = usePlayer()



  const handlePlay = ()=>{
  
   
          current_track.id === song.id?  webPlayer.togglePlay():spodify.play({ uris: [song.uri] })
             
           if(!player.isPlaying){ 
             player.setIsPlaying(true)
            }else{
              player.setIsPlaying(false)
            }
            
            player.setIsLikedPlaylist(true)

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
          className={`w-10 h-10 ${onHovered ? "opacity-50" : ""}`}
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