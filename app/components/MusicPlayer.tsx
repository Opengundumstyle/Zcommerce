'use client'

import useGetSongById from '@/hooks/useGetSongById';
import usePlayer from '@/hooks/usePlayer';
import useSpotify from '@/hooks/useSpotify';


import PlayerContent from './PlayerContent';
import Playlists from './Playlists';
import Songs from './Songs';
import Explore from './Explore';

import { useSession } from '@/store';
import useCartStore from '@/store';
import { Session } from "next-auth"

import style from '../../styles/MusicPlayer.module.css'
import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';
import spotifyApi from '@/lib/spotify';


import { signIn} from "next-auth/react";

import { BsFillInfoSquareFill} from "react-icons/bs";


import { BiSearch } from "react-icons/bi";

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

    const[playlistDisplay,setPlaylistDisplay] = useState(false)

    const [playlists,setPLaylists] = useState()

    const [favSongs,setFavSongs]  = useState()

    const [showExplore,setExplore] = useState(false)

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
    
    

    const [is_active, setActive] = useState(false);
    const [is_paused,setPaused] = useState(false)
    const [context, setContext] = useState();
    const [current_track, setTrack] = useState(track);
    const [webPlayer,setWebPlayer] = useState(undefined)
    const [duration,setDuration] = useState(0)
    const [position,setPosition] = useState(0)
    
    

    async function handleSpotifySignIn(){
      if(session.isSession)session.toggleSession()
      signIn('spotify',{callbackUrl:'https://zcommerce-silk.vercel.app'})
 }


    const handleExplore=()=>{
         setExplore(true)
         setPlaylistDisplay(false)
        
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
                console.log('Player State',state)
                if (!state) {
                    return;
                }
                
                setContext(state.context)
                setTrack(state.track_window.current_track);
                setPaused(state.paused)
                setPosition(state.position)
                setDuration(state.duration)
              

                musicplayer.setIsRepeat(state.repeat_mode);
                musicplayer.setIsShuffe(state.shuffle);
               

       

                (state.paused)?musicplayer.setIsPlaying(false):musicplayer.setIsPlaying(true)
              
                
                musicplayer.togglePlayer(true)

                player.getCurrentState().then( state => { 
                    console.log('Current State:', state);
                     musicplayer.setCurrentSong(state?.track_window.current_track.name);
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
              let favIds: string[] = []
            
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
                     
                      favIds.push(id)
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
                    musicplayer.setfavIds(favIds)
                    context?.uri && musicplayer.setIsLikedPlaylist(false)
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

  
 

  return (
    <div 
       className={`flex flex-col gap-4 items-center
                  ${!session.isSession? musicplayer.isOpen?`${style.music_player} pt-10`:'hidden':''} 
                  ${cart.isOpen && 'hidden'}`}
                  onMouseEnter={()=>setPlayerHovered(true)}
                  onMouseLeave={()=>setPlayerHovered(false)}
                      >
        {(!musicplayer.activeId)&&(session.isSession) &&<SpotifyAd/>}

        <div className='flex flex-row justify-start items-center gap-5'>

           { spodify.getAccessToken() && playerHovered && !session.isSession && ( !showExplore?(
             <div className='absolute top-3 left-16 m-4 font-normal flex flex-row gap-2 items-center'>
              <div className="text-gray-500 font-bold font-serif text-md hover:text-teal-700 cursor-pointer hover:scale-110 hover:underline transition duration-300"
                    onClick={handleExplore}>
                      <div className='flex flex-row gap-1 items-center'>
                      <BiSearch className='text-lg'/>
                       Explore
                      </div>
              </div>
              <hr className="text-teal-700"/>
             { playlistDisplay?
              <div className="text-gray-500 font-serif text-sm">
                    Playlists
              </div>:
              <div className="text-gray-500 font-serif text-sm">
                    Liked Songs
              </div>}
              </div>):
               <div className='absolute top-3 left-16 m-4 font-normal flex flex-row gap-2'>
                    <div className='text-gray-500 font-serif text-sm hover:text-white cursor-pointer hover:scale-110 hover:underline transition duration-300'
                         onClick={()=>{
                             setExplore(false)
                         }}
                    >
                      Liked Songs
                    </div>
                    <div className='text-gray-500 font-serif text-sm hover:text-white cursor-pointer hover:scale-110 hover:underline transition duration-300'
                         onClick={()=>{
                            setExplore(false)
                            setPlaylistDisplay(true)
                         }}
                    >
                      Playlists
                    </div>
              </div>)
              }
              
                <PlayerContent 
                    key={song?.song_path}
                    song={song} songUrl={song?.song_path} 
                    playerHovered={playerHovered}
                    current_track={current_track}
                    webPlayer={webPlayer}
                    spodify={spodify}
                    is_paused={is_paused}
                    duration={duration}
                    position={position}
                    playlists={playlists} 
                    />
       
            
            {favSongs && playerHovered && !playlistDisplay && !showExplore&&
                  <div className='flex flex-col'>
                  <Songs 
                    songs={favSongs} 
                    webPlayer={webPlayer} 
                    spodify={spodify} 
                    current_track={current_track}/>
                  <div
                    className='mt-4
                              text-gray-400
                              cursor-pointer 
                              transition duration-200 
                              hover:text-white
                              hover:bg-opacity-30
                              flex 
                              justify-start
                              items-center
                              rounded-sm
                              py-1
                              '
                    onClick={()=>{setPlaylistDisplay(true)}}
                    >
                      <span className="p-2 text-sm">More playlists</span>
                  </div>

              </div>}

            {playlists && playerHovered && playlistDisplay && !showExplore&&
              
                      <div className='flex flex-col'>
                      
                        <Playlists 
                         playlists={playlists} 
                         spodify={spodify}
                         webPlayer={webPlayer}
                         current_track={current_track}
                         context={context}
                         setPlaylistDisplay={setPlaylistDisplay}
                         />

                    </div>
          
              }
            {showExplore&&playerHovered &&
            
            
                 <Explore spodify={spodify} webPlayer={webPlayer} current_track={current_track} />
         
            }


                
        </div>

       {(!musicplayer.activeId)&&(session.isSession)|| user?'':!playerHovered && !session.isSession? '': !current_track.name?
          <motion.div 
           className='p-3 text-sm flex flex-row gap-1 items-center relative'
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
            >  
              <div className='font-bold'>
              Listen 
              </div>
              with
              <span className=' text-teal-700 font-semibold hover:font-bold hover:underline cursor-pointer text-md' 
              onClick={handleSpotifySignIn}>
              Spotify
              </span> 

             instead 
              
              <div 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <a href="https://www.spotify.com/us/premium/?utm_source=us-en_brand_contextual-desktop_text&utm_medium=paidsearch&utm_campaign=alwayson_ucanz_us_performancemarketing_core_brand+contextual-desktop+text+exact+us-en+google&gclid=Cj0KCQjwtamlBhD3ARIsAARoaEydt8AH3rd3IvDN8nZbKNFFMwq030viP_QLIYOpeou0gQUS5G5kUkMaAs77EALw_wcB&gclsrc=aw.ds" target='_blank'>
               <BsFillInfoSquareFill
                className="cursor-pointer"
               />
               </a>
        
              {isHovered && (
                <div className={`absolute top-9 left-0 p-3 bg-white border border-gray-300 rounded text-gray-500`}>
                  <p>Only works for&nbsp;
                      <a href='https://www.spotify.com/us/premium/?utm_source=us-en_brand_contextual-desktop_text&utm_medium=paidsearch&utm_campaign=alwayson_ucanz_us_premiumbusiness_premium_brand+contextual-desktop+text+exact+us-en+google&gclid=Cj0KCQjwnf-kBhCnARIsAFlg493wvTXow7AQFzWaDbIQ6f8HbIdzRRiASaAdHb7oWwl8Hxmhih_qK6YaAi5VEALw_wcB&gclsrc=aw.ds' 
                       target='_blank' className='font-bold hover:text-teal-700'>
                        premium user
                      </a> for now. But hang tight, we are working on it !!</p>
                </div>
              )}
              </div>
             </motion.div>:''
           }
          
    </div>
  );
};

export default MusicPlayer;