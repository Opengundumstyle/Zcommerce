
'use client'


import useGetSongById from '@/hooks/useGetSongById';
import usePlayer from '@/hooks/usePlayer';
import useSpotify from '@/hooks/useSpotify';

import PlayerContent from './PlayerContent';
import { useSession } from '@/store';
import useCartStore from '@/store';
import { Session } from "next-auth"

import style from '../../styles/MusicPlayer.module.css'


import { useEffect, useState } from 'react';
import spotifyApi from '@/lib/spotify';

const MusicPlayer = ({user}:Session) => {


    const player = usePlayer()

    const {song} = useGetSongById(player.activeId)

    const session = useSession()

    const cart = useCartStore()

    const [playerHovered,setPlayerHovered] = useState(false)

    const [playlists,setPLaylists] = useState()

    const spodify = useSpotify(user as Session)

    console.log('what is this spodify sht',spodify)
    
    useEffect(()=>{
        if(spodify.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data)=>{
                 setPLaylists(data.body.items)
            })
        }
    },[user,spotifyApi])


   console.log(playlists)

       
    const SpotifyAd = ()=>{
        return (
            <div className='max-w-xs font-sans font-light text-gray-400 text-sm'>
             Try listening to music while shopping? check out zcommerce's playlist 
            </div>
        )
    }



  return (
    <div 
       className={`flex flex-col gap-4 
                  ${!session.isSession? player.isOpen?`${style.music_player} pt-10`:'hidden':''} 
                  ${cart.isOpen && 'hidden'} 
                  
                  `}
                  onMouseEnter={()=>setPlayerHovered(true)}
                  onMouseLeave={()=>setPlayerHovered(false)}
                  >
    {(!player.activeId)&&(session.isSession)&& <SpotifyAd/>}
    <PlayerContent key={song?.song_path} song={song} songUrl={song?.song_path} playerHovered={playerHovered}/>
    </div>
  );
};

export default MusicPlayer;