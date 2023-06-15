
'use client'


import useGetSongById from '@/hooks/useGetSongById';
import usePlayer from '@/hooks/usePlayer';

import PlayerContent from './PlayerContent';



const MusicPlayer = () => {


    const player = usePlayer()

    const {song} = useGetSongById(player.activeId)

    console.log('what is player',player)
    
    // if (!song  || !player.activeId) {
       
    //   return null
          
    // }

  return (
    <PlayerContent key={song?.song_path} song={song} songUrl={song?.song_path} />
  );
};

export default MusicPlayer;