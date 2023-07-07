'use client'

import Song from "./Song";
import { useEffect,useState} from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { BsTrash3 } from "react-icons/bs";


const Playlist = ({playlistId,spodify,webPlayer,current_track,setOpenPlaylist,description,image,name,tracksNum,owner}:any) => {

    
  const [songs,setSongs] = useState([])
  const [hasPermission, setHasPermission] = useState(false);

  

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
      };

      getSongsFromPlaylist()
    

},[])


useEffect(() => {

  const checkDeletePermission = async () => {
    try {
      // Get the user ID
      const meResponse = await spodify.getMe();
      const userId = meResponse.body.id;

      // Check if the user is following the playlist
       let permission = owner.id === userId
      setHasPermission(permission);
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };

  checkDeletePermission();
}, []);


// Delete a playlist
const deletePlaylist = async () => {
  
  spodify.unfollowPlaylist(playlistId)

  .then(function() {
     console.log('Playlist successfully unfollowed!');
     toast('removed playlist', {
      icon: '🫡',
    });
  }, function(err) {
    console.log('Something went wrong!', err);
  });
};

    

    return (
      <div className="flex flex-col gap-4">
        
      <div className="overflow-y-auto max-h-64">

          {/**Playlist abnner */}
          <div className="flex flex-row justify-start items-center gap-4 bg-teal-700 bg-opacity-40 p-4 rounded-t-md"
             style={{
              background: 'linear-gradient(to bottom, #00796B, rgba(0,0,0,0))'
            }}>
            <Image src={image} alt={name} width={50} height={50} className="rounded-md w-20 h-20" />
            <div className="title flex flex-col items-start gap-1">
              <div className="font-bold text-xl text-white">{name}</div>
              {description && <div className="text-gray-300 text-sm">{description}</div>}
              <div className="flex flex-row items-center text-gray-300 text-sm gap-10">
                 <div className="flex flex-row gap-2">
                  <div>{owner.display_name}</div>
                  <div>{tracksNum} {`${tracksNum === 1 ?'song':'songs'}`}</div>
                </div>

                {hasPermission && 
                <BsTrash3 className="cursor-pointer hover:text-white hover:scale-110 text-lg "
                          onClick={deletePlaylist}
                /> }
              
              </div>
            </div>
          </div>

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