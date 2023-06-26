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
import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';
import spotifyApi from '@/lib/spotify';


import { signIn} from "next-auth/react";

const MusicPlayer = ({user}:Session) => {

      const track = {
        name: "",
        album: {
            images: [
                { url: "" }
            ]
        },
        artists: [
            { name: "" }
        ]
    }

    const transferPlaybackHere = (deviceId) => {
      fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          authorization: `Bearer ${user?.accesstoken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "device_ids": [deviceId],
          "play": true,
        }),
      });
    };



  

    const spodify = useSpotify(user as Session)

    const musicplayer = usePlayer()

    const {song} = useGetSongById(musicplayer.activeId,musicplayer.uri)
    
    const session = useSession()

    const cart = useCartStore()

    const [playerHovered,setPlayerHovered] = useState(false)

    const [playlists,setPLaylists] = useState()

    const [favSongs,setFavSongs]  = useState()


    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [webPlayer,setWebPlayer] = useState(undefined)


    async function handleSpotifySignIn(){
      if(session.isSession)session.toggleSession()
      signIn('spotify',{callbackUrl:'http://localhost:3000'})
 }
   
   
    useEffect(()=>{ 
     if(spodify.getAccessToken()){
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;

          document.body.appendChild(script);
          
          window.onSpotifyWebPlaybackSDKReady = ()=>{


              const player = new window.Spotify.Player({
                  name:"Web Playback SDK",
                  getOAuthToken:cb =>{cb(user?.accesstoken)},
                  volume:0.5
              })

              setWebPlayer(player)


              player.addListener('ready', ({ device_id }) => {
                  console.log('Ready with Device ID', device_id);
                  transferPlaybackHere(device_id)
  
              });

              player.addListener('not_ready', ({ device_id }) => {
                  console.log('Device ID has gone offline', device_id);
                

              });

              

              player.addListener('player_state_changed', ( state => {
                console.log('what is the fking state',state)
                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
  
                if(!state.paused)musicplayer.setIsPlaying(true)

                musicplayer.togglePlayer(true)

                player.getCurrentState().then( state => { 
                    console.log('Current State:', state);
                    (!state)? setActive(false) : setActive(true) 
                   
                });

            }));



              player.connect().then(success => {
                  if (success) {
                    console.log('The Web Playback SDK successfully connected to Spotify!');
                  }
                })
              }
      
      }

    },
    [])






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

    
      // fetch all liked songs from spotify
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
      

                    const likedSongs = items.map((item) => {
                      const { id, name, album, artists, uri } = item.track;
                
                      // Find the corresponding album for the current song
                      const albumInfo = albums.find(item => item.id === album.id);
                      const image = albumInfo?.images[0]?.url || '';
                
                      return {
                        id,
                        name,
                        uri,
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
          
        const SpotifyAd = ()=>{
            return (
                <div className='max-w-xs font-sans font-light text-gray-400 text-sm'>
                  Try listening to music while shopping? check out zcommerce's playlist 
                </div>
            )
        }

  console.log('webplayer',webPlayer)
  console.log('current track',current_track)
  console.log('my playlists',playlists)

  return (
    <div 
       className={`flex flex-col gap-4 items-center
                  ${!session.isSession? musicplayer.isOpen?`${style.music_player} pt-10`:'hidden':''} 
                  ${cart.isOpen && 'hidden'}`}
                  onMouseEnter={()=>setPlayerHovered(true)}
                  onMouseLeave={()=>setPlayerHovered(false)}
                      >
        {(!musicplayer.activeId)&&(session.isSession) &&<SpotifyAd/>}
        <div className='flex flex-row justify-evenly items-center'>
        {/* {playlists && <Playlist playlists={playlists}/>}  */}
      
            <PlayerContent 
                key={song?.song_path}
                song={song} songUrl={song?.song_path} 
                playerHovered={playerHovered}
                current_track={current_track}
                webPlayer={webPlayer}
                />
             {favSongs && playerHovered && 
                   <Songs 
                   songs={favSongs} 
                   webPlayer={webPlayer} 
                   spodify={spodify} 
                   current_track={current_track}/>}

              
        </div>

       {(!musicplayer.activeId)&&(session.isSession)?'':!playerHovered && !session.isSession? '': !current_track.name?
          <motion.div 
           className='p-3 text-sm'
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
            > Listen with <span className=' text-teal-700 font-semibold hover:font-bold hover:underline cursor-pointer' 
             onClick={handleSpotifySignIn}>
           Spotify</span> instead</motion.div>:''
           }
          
    </div>
  );
};

export default MusicPlayer;