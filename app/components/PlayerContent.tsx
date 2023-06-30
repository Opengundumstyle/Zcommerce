
'use client'

import { Song } from "@/types/SongType";

import { useState, useEffect,useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import usePlayer from '@/hooks/usePlayer';
import Slider from './Slider'; 
import { useSession } from "@/store";

import { AiFillStepForward,AiFillStepBackward } from "react-icons/ai";
import { HiSpeakerWave,HiSpeakerXMark } from "react-icons/hi2";
import useSound from 'use-sound';

import useSongInfo from "@/hooks/useSongInfo";
import SpotifyWebApi from "spotify-web-api-node"; 

import {BsRepeat,BsShuffle,BsRepeat1,BsPlusSquare } from "react-icons/bs";

import { AiFillHeart,AiOutlineHeart } from "react-icons/ai";

//BsPlusSquare
//BsSuitHeart
//BsSuitHeartFill
//BsTrash3
//AiFillHeart
//AiOutlineHeart

interface PlayerContentProps {
    song?: Song;
    songUrl?: string;
    playerHovered:boolean;
    current_track:any;
    webPlayer:any;
    spodify:SpotifyWebApi;
    is_paused:boolean;
    duration:Number;
    position:Number;
  }


  const PlayerContent: React.FC<PlayerContentProps> = ({ 
    song, 
    songUrl,
    playerHovered,
    current_track,
    webPlayer,
    spodify,
    is_paused,
    position,
    duration,
  }) => {

    const [isHovered, setIsHovered] = useState(false);

    // Declare a ref to store the previous value of is_paused
    const prevIsPausedRef = useRef(false);

    const player = usePlayer()

    const session = useSession()
    
    const[volume,setVolume] = useState(1)

    const VolumeIcon = volume === 0? HiSpeakerXMark:HiSpeakerWave

    const PREVIOUS = 'prev'
    const NEXT = 'next'
    
    const prevSong = useSongInfo(spodify,current_track?.id,PREVIOUS)
    const nextSong = useSongInfo(spodify,current_track?.id,NEXT)
    

    const toggleMute = ()=>{
        if(volume === 0){
            setVolume(1)
        }else{
            setVolume(0)
        }
      }
    
      
      const onPlayNext = ()=>{

        if(current_track.name){

           if(player.isLikedPlaylist){
            
            spodify.play({ uris: [nextSong?.uri] })
            
            }else{
                webPlayer.nextTrack()
            }
           
        }else{ 

          if(player.ids.length === 0){
           return 
          }
 
        const currentIdx = player.ids.findIndex((id)=>id === player.activeId)
        const nextSong  = player.ids[currentIdx + 1]
        if(!nextSong){
           return player.setId(player.ids[0])
        }
        
        player.setId(nextSong)}
        
    }
 
   
    const onPlayPrevious = ()=>{
      if(current_track.name){
           if(player.isLikedPlaylist){
    
                spodify.play({ uris: [prevSong?.uri] })
                
           }else{
               webPlayer.previousTrack()
           }

      }else {  
          if(player.ids.length === 0){
            return 
          }
    
        const currentIdx = player.ids.findIndex((id)=>id === player.activeId)
        const previousSong  = player.ids[currentIdx - 1]

        if(!previousSong){
            return player.setId(player.ids[player.ids.length-1])
        }
    
        player.setId(previousSong)}
     
 }


 const handlePlay = () =>{
        
      if(current_track.name){
        
          !player.isPlaying && webPlayer.togglePlay()
          !player.isPlaying && player.setIsPlaying(true)
      }else{

        if(player.activeId === undefined){ 
        player.setId('1')
        }
        player.setIsPlaying(true)
        play()

      }

        
        player.togglePlayer(true)
    
    

  }


  const handlePause = () => {

        player.isPlaying && player.setIsPlaying(false)

        if(current_track.name){
          player.isPlaying && webPlayer.togglePlay()
        }else{
          pause()
        } 

  }

 const shuffle = ()=>{
    if(player.isShuffle === false){

     spodify.setShuffle(true).then(function() {

      player.setIsShuffe(true)

      console.log('Shuffle is on.');
      }, function  (err) {
        //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
        console.log('Something went wrong!', err);
      });
      }else{
          spodify.setShuffle(false)
          player.setIsShuffe(false)
      }
}

 const repeat = ()=>{

  if(player.isRepeat === 0){
   
    spodify.setRepeat('track')

    .then(function () {
      player.setIsRepeat(1)
      console.log('Repeat track.');
      }, function(err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      console.log('Something went wrong!', err);
    });
    }else{
      spodify.setRepeat('off')
      player.setIsRepeat(0)
    }
}




  const [play, { pause, sound }] = useSound(
    songUrl as string,
    { 
      volume: volume,
      onplay: () => {if(!player.isPlaying)player.setIsPlaying(true)},
      onend: () => {
       player.isPlaying && player.setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => { if(player.isPlaying)player.setIsPlaying(false)},
      format: ['mp3']
    }
  );


// automatically play spotify liked songs in order
useEffect(()=>{
  // if it's not from liked songs,use spotify auto playlist 
  if(!player.isLikedPlaylist)return
       // Check if is_paused changed from false to true
  if (!prevIsPausedRef.current && is_paused) {
    if (position === 0) {
      if (nextSong) {
        spodify.play({ uris: [nextSong?.uri] });
      }
    }
  }

  // Update the previous value of is_paused
  prevIsPausedRef.current = is_paused;
  
},[is_paused])



// play zcommerce playlist
useEffect(()=>{
    console.log('do u have? current track',current_track.name)
    if(current_track.name) return
    sound?.play()
    return ()=>{
      sound?.unload()
    }
  },[sound])

    return (

    <div className="flex flex-col items-center justify-center">
      <div  className={`relative w-48 h-48 bg-gray-300 rounded-full`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              animation: `spin 4s infinite linear`,
              animationPlayState: player.isPlaying? 'running' : 'paused',
              border: '2px solid rgba(0, 0, 0, 0.2)',
            }}>
         <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
         {/** image cover */}
          {current_track.name?
            <img src={current_track.album.images[0].url || 'https://e7.pngegg.com/pngimages/915/866/png-clipart-compact-disc-music-no-age-polyvinyl-record-co-phonograph-record-disco-in-vinile-album-poster.png'}  alt="Song Cover"
             className={`w-full h-full object-cover transition duration-300 ease-in-out transform hover:scale-105 ${isHovered?'blur-sm':''}`}/>:
          <img
            src={
              song?.image_path ||
              'https://e7.pngegg.com/pngimages/915/866/png-clipart-compact-disc-music-no-age-polyvinyl-record-co-phonograph-record-disco-in-vinile-album-poster.png'
            }
            alt="Song Cover"
            className={`w-full h-full object-cover transition duration-300 ease-in-out transform hover:scale-105 ${isHovered?'blur-sm':''}`}
          />}

          <div className={`absolute inset-0 flex items-center justify-center opacity-0 ${isHovered ?'opacity-100':''}`}>
              <div className='flex flex-col items-center justify-center'>
               <p className={`text-white text-lg font-bold `}>{current_track.name?current_track.name:song?.title}</p>
               {current_track.name?<p className='text-gray-200 text-xs'>by &nbsp;{current_track.artists[0].name}</p>:song && <p className='text-gray-200 text-xs'>by &nbsp;{song?.author}</p>} 
            </div>
          </div>
        </div>
      </div>

       {/**speaker */}
       {(!playerHovered && !session.isSession)?'':
       <div className="flex flex-row justify-center gap-5 items-center">
          <div className='mt-3 text-2xl text-gray-500 flex flex-row items-center justify-start hover:scale-110 transition duration-300 ease-in-out transform'>
      
                <VolumeIcon
                  onClick={toggleMute}
                  className='cursor-pointer'
                />
                <Slider 
                  value={volume}
                  onChange={(value)=>setVolume(value)}
                />
          </div>

             {/* <BsPlusSquare/>
            < AiFillHeart className="text-2xl fill-red-400 cursor-pointer"/> */}
        </div>
       }

      {/**Player and back+forward button*/}

        {(!playerHovered && !session.isSession)?'':
              <div className='flex flex-row space-x-3 justify-center items-center mt-3'>

           { spodify.getAccessToken() && <BsShuffle 
                  className={`text-3xl hover:bg-gray-100 rounded-full p-1 cursor-pointer transition duration-300 ease-in-out transform text-gray-500 hover:text-teal-700 hover:scale-105 ${player.isShuffle && 'text-teal-700'}`}
                  onClick={shuffle}
                /> 
             }
            
              <AiFillStepBackward className='text-4xl hover:bg-gray-100 rounded-full p-1 cursor-pointer transition duration-300 ease-in-out transform text-gray-500 hover:text-teal-700 hover:scale-105'
                                  onClick={onPlayPrevious}/>
    

                <div className="flex items-center p-1">
                  {player.isPlaying ? (
                    <FaPause 
                      className="text-2xl text-base-700 cursor-pointer items-center "
                      onClick={handlePause}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                        />
                  ) : (
                    <FaPlay className="hover:scale-110 text-2xl text-base-700 hover:text-teal-700 cursor-pointer items-center transition duration-300 ease-in-out transform" 
                      onClick={handlePlay}/>
                  )}
                </div>
            
          
                <AiFillStepForward 
                  className='text-4xl hover:bg-gray-100 rounded-full p-1 cursor-pointer transition duration-300 ease-in-out transform text-gray-500 hover:text-teal-700 hover:scale-105'
                  onClick={onPlayNext}
                  />

               { spodify.getAccessToken() && <> { player.isRepeat?
                      <BsRepeat1 
                        className="text-4xl hover:bg-gray-100 rounded-full p-1 cursor-pointer transition duration-300 ease-in-out transform text-teal-700 hover:text-black hover:scale-105"
                        onClick={repeat}/>:
                      <BsRepeat 
                        className="text-3xl hover:bg-gray-100 rounded-full p-1 cursor-pointer transition duration-300 ease-in-out transform text-gray-500 hover:text-teal-700 hover:scale-105"
                        onClick={repeat}
                   />}
                   </>}
              </div>
          }
    </div>
    
    )

  }



  export default PlayerContent;