
'use client'


import useGetSongById from '@/hooks/useGetSongById';
import usePlayer from '@/hooks/usePlayer';

import PlayerContent from './PlayerContent';
import { useSession } from '@/store';
import useCartStore from '@/store';

import style from '../../styles/MusicPlayer.module.css'


import { useState } from 'react';

const MusicPlayer = () => {


    const player = usePlayer()

    const {song} = useGetSongById(player.activeId)

    const session = useSession()

    const cart = useCartStore()

    const [playerHovered,setPlayerHovered] = useState(false)
       
    const SpotifyAd = ()=>{
        return (
            <div className='max-w-xs font-sans font-light text-gray-400 text-sm'>
             Listen to music while shopping? try zcommerce's playlist or
              Sign in with Spotify for more song selections!
            </div>
        )
    }



  return (
    <div 
       className={`flex flex-col gap-4 
                  ${!session.isSession && `${style.music_player} pt-10`} 
                  ${cart.isOpen && 'hidden'}`}
                  onMouseEnter={()=>setPlayerHovered(true)}
                  onMouseLeave={()=>setPlayerHovered(false)}
                  >
    {(!player.activeId)&&(session.isSession)&& <SpotifyAd/>}
    <PlayerContent key={song?.song_path} song={song} songUrl={song?.song_path} playerHovered={playerHovered}/>
    </div>
  );
};

export default MusicPlayer;