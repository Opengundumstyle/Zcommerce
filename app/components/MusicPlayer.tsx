
'use client'


import useGetSongById from '@/hooks/useGetSongById';
import usePlayer from '@/hooks/usePlayer';
import useSpotify from '@/hooks/useSpotify';

import PlayerContent from './PlayerContent';
import Playlist from './Playlists';
import Songs from './Songs';

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

    const [favSongs,setFavSongs]  = useState()

    const spodify = useSpotify(user as Session)


    // Function to fetch album information in batches
      async function fetchAlbums(ids) {
        const albums = [];

        // Split the array of album IDs into smaller batches
        const batchSize = 20;
        const batches = Array.from({ length: Math.ceil(ids.length / batchSize) }, (_, index) =>
          ids.slice(index * batchSize, (index + 1) * batchSize)
        );

        // Fetch album information for each batch of IDs
        for (const batch of batches) {
          const response = await spotifyApi.getAlbums(batch);
          albums.push(...response.body.albums);
        }

        return albums;
      }


  
    
        useEffect(()=>{
            if(spodify.getAccessToken()){
                spotifyApi.getUserPlaylists().then((data)=>{
                    setPLaylists(data.body.items)
                })

                // Function to recursively fetch all liked songs
            const getAllLikedSongs = async(offset:number = 0, limit:number = 50)=> {
              
                  try {
                    const response = await spotifyApi.getMySavedTracks({ limit, offset });
                    const { items } = response.body;

                    if (items.length === 0) {
                      // Reached the end, all liked songs have been fetched
                      return [];
                    }


                    const albumIds = items.map(item => item.track.album.id);

                    // Fetch album information in batches
                    const albums = await fetchAlbums(albumIds);
                    console.log('albums',albums)

                    const likedSongs = items.map((item) => {
                      const { id, name, album, artists } = item.track;
                
                      // Find the corresponding album for the current song
                      const albumInfo = albums.find(item => item.id === album.id);
                      const image = albumInfo?.images[0]?.url || '';
                
                      return {
                        id,
                        name,
                        album: album.name,
                        artists: artists.map(artist => artist.name).join(', '),
                        image
                      };
                    });
                    // Fetch the next batch of liked songs
                    const nextOffset = offset + limit;
                    const nextSongs = await getAllLikedSongs(nextOffset, limit);

                    // Concatenate the current batch with the next batch of liked songs
                    return [...likedSongs, ...nextSongs];
                  } catch (error) {
                    throw new Error('Failed to fetch liked songs');
                  }
                }

                  getAllLikedSongs()
                  .then((likedSongs) => {
        
                    setFavSongs(likedSongs)
                    // Process and display the liked songs
                  })
                  .catch((error: any) => {
                    console.error('Error:', error);
                  });


            }
        },[user,spotifyApi])


      console.log(playlists)
      console.log(favSongs)

          
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
                  ${cart.isOpen && 'hidden'}`}
                  onMouseEnter={()=>setPlayerHovered(true)}
                  onMouseLeave={()=>setPlayerHovered(false)}
                      >
        {(!player.activeId)&&(session.isSession)&& <SpotifyAd/>}
        <div className='flex flex-row justify-evenly items-center'>
        {/* {playlists && <Playlist playlists={playlists}/>}  */}
       
            <PlayerContent 
                key={song?.song_path}
                song={song} songUrl={song?.song_path} 
                playerHovered={playerHovered}
                playlists={playlists}
                />
             {favSongs && <Songs songs={favSongs}/>}
        </div>
    </div>
  );
};

export default MusicPlayer;