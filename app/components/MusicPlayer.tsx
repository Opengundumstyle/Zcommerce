
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