'use client'

import Song from "./Song";
import { useEffect,useState} from "react";

const Playlist = ({playlistId,spodify,webPlayer,current_track,setOpenPlaylist}:any) => {

    
  const [songs,setSongs] = useState([])

  

useEffect( ()=>{
     

    
    const getSongsFromPlaylist = async () => {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: {
            Authorization:`Bearer ${spodify.getAccessToken()}`
          },
        });
    
        if (!response.ok) {
          // Handle error if the request fails
          console.error("Failed to fetch playlist songs");
          return;
        }
    
        const data = await response.json();
        const songs = data.items.map((item: { track: any; }) => {

                 let song = item.track

                 console.log('let me see the songs from fetchplaylist before it disappears',song)

                 let newSong = {
                 id: song.id,
                 name:song.name,
                 uri:song.uri,
                 album: song.album.name,
                 artists: song.artists.map((artist: { name: any; }) => artist.name).join(', '),
                 image:song.album.images[0].url
                 }

                 return newSong
              });
     
        setSongs(songs)
          
        // Do something with the songs data
      };

      getSongsFromPlaylist()
    

},[])




    

    return (
      <div className="flex flex-col gap-4">
        
      <div className="overflow-y-auto max-h-64">
        <div className="p-4">
          {songs.map((song, index) => (
              <Song song={song} 
                    index={index} 
                    key={index} 
                    webPlayer={webPlayer} 
                    spodify={spodify} 
                    current_track={current_track} 
                    playlistId={playlistId}
                    />
            )
            )}

        </div>
      </div>
       
       <div onClick={()=>setOpenPlaylist(false)}
           className="flex flex-row justify-end p-1 cursor-pointer hover:text-white text-gray-400 transition duration-200 text-sm">
           back to playlists
         </div>

      </div>
    );
  };
  
  export default Playlist