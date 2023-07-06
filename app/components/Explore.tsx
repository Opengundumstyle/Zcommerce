
import { useState,useEffect} from "react"
import Image from "next/image"
import Song from "./Song"
import usePlayer from "@/hooks/usePlayer";

import {AiFillPlayCircle,AiFillPauseCircle } from "react-icons/ai";

const Explore = ({spodify,webPlayer,current_track}:any)=>{

      
    const [query,setQuery] = useState("")
    const [searchInfo,setSearchInfo] = useState(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [topResultHovered,setTopResultHover] = useState(false)

    const player = usePlayer()

   

    useEffect(()=>{
        const fetchProducts = async()=>{
            try{
              const encodedSearchTerm = encodeURIComponent(query);
              const url = `https://api.spotify.com/v1/search?q=${encodedSearchTerm}&type=track,artist,album,playlist`;
              const response = await fetch(url, {
                headers: {
                  Authorization: `Bearer ${spodify.getAccessToken()}`, 
                },
              });
          
              const data = await response.json()
              setSearchInfo(data)
              console.log('what is the seatch result',searchInfo)
              setIsDropdownOpen(true);
             
            }catch(err){
              console.error("Error fetching goods:", err);
            }
        }
         
        if(query){
          console.log('is it fetching')
            fetchProducts()
        }else{
            setSearchInfo(null)
            setIsDropdownOpen(false)
        }


  },[query])




  const topResult = ()=>{

      const albumName = searchInfo?.albums.items[0].name.toLowerCase()
      const songName = searchInfo?.tracks.items[0].name.toLowerCase()
      const artistName =searchInfo?.artists.items[0].name.toLowerCase()
  

      const getTopResult = ()=>{

           if(songName.includes(query)){
                return {
                    name:searchInfo?.tracks.items[0].name,
                    image:searchInfo?.tracks.items[0].album.images[0].url,
                    uri:searchInfo?.tracks.items[0].uri,
                    artistName:searchInfo?.tracks.items[0].artists.map((artist: { name: any }) =>artist.name).join(','),
                    id:searchInfo?.tracks.items[0].id,
                    type: 'song'
                 }
           }else if(artistName.includes(query)){
                return {
                  name:searchInfo?.artists.items[0].name,
                  image:searchInfo?.artists.items[0].images[0].url,
                  uri:searchInfo?.artists.items[0].uri,
                  id:searchInfo?.tracks.items[0].id,
                  type:'artist'
              }
             
           }else if(albumName.includes(query)){
                return {
                  name:searchInfo?.albums.items[0].name,
                  image:searchInfo?.albums.items[0].images[0].url,
                  uri:searchInfo?.albums.items[0].uri,
                  id:searchInfo?.tracks.items[0].id,
                  type:'album'
                  
              }
           }else{
              return{
                name:searchInfo?.tracks.items[0].name,
                image:searchInfo?.tracks.items[0].album.images[0].url,
                uri:searchInfo?.tracks.items[0].album.uri,
                artistName:searchInfo?.tracks.items[0].artists.map((artist: { name: any }) =>artist.name).join(', '),
                id:searchInfo?.tracks.items[0].id,
                type: 'song'
              }
           }
           
      }

      const onPlayClick = (uri,id,type)=>{
     
        if(current_track.id === id) {
          webPlayer.togglePlay()
         }else{ 
          if(type === 'album' || type === 'artist'){
            spodify.play({context_uri:uri})
          }else{
           spodify.play({uris:[uri]})
          }
         }
      
}
    
      const result = getTopResult();

      return(
       
          <div className="card bg-black hover:bg-gray-800 rounded-md p-3 cursor-pointer shadow-lg bg-opacity-50 w-[250px]">
            <div className="flex flex-row justify-start items-center gap-3">
            <Image src={result?.image} alt={result?.name} width={70} height={70} className="card-image w-70 h-70 object-cover rounded-md py-2 " />
          {player.isPlaying && current_track.id === result.id?
           <AiFillPauseCircle className="fill-teal-700 flex-1" size={50} onClick={()=>onPlayClick(result.uri,result.id,result.type)}/>:
           <AiFillPlayCircle className="fill-teal-700 flex-1" size={50} onClick={()=>onPlayClick(result.uri,result.id,result.type)}/>}
            </div>
            <div className="card-content">
              <h6 className="card-title text-white text-md">{result?.name}</h6>
              <div className="flex flex-row items-center justify-start gap-2">
                  <p className="card-artist text-gray-300 text-xs">{result?.artistName}</p>
                  <p className="card-type rounded-full bg-slate-600 text-gray-300 px-2 text-xs">{result?.type}</p>
                  {/* <a href={result?.uri} className="card-link" target="_blank" rel="noopener noreferrer"> */}
                     
                  {/* </a> */}
              </div>
            </div>
          </div>
        );
 
  }





const Songs = ()=>{
   
    const topFiveSongs = searchInfo?.tracks.items.slice(0,5).map((song: { id: any; name: any; uri: any; album: { name: any; images: { url: any; }[]; }; artists: { name: any; }[]; },index: any)=>{

           let newItem = {
              id:song.id,
              name:song.name,
              uri:song.uri,
              album: song.album.name,
              artists: song.artists.map((artist: { name: any; }) => artist.name).join(', '),
              image:song.album.images[0].url
           }

           const explore = true
          return (
           
                <Song song={newItem} 
                      index={index} 
                      key={index} 
                      webPlayer={webPlayer} 
                      spodify={spodify} 
                      current_track={current_track}
                      explore={explore}
                      />
        
          )



    })

    return topFiveSongs

   
}




console.log('what is songs',searchInfo)

    return( 
      <div className='min-w-full flex flex-col justify-start relative'>
        <input type="text" placeholder="What you want to listen to?" 
                className="input input-bordered input-accent rounded-full text-black min-w-full" 
                onChange={e=>setQuery(e.target.value)}
                value={query}/>
      
      {isDropdownOpen && (
        <div className="top-14 rounded-md text-black absolute flex flex-col overflow-y-auto max-h-48">
           {/**top result and songs */}
             <div className="flex flex-row justify-start gap-2 items-baseline">
               <div className="flex flex-col gap-1">
                 <h5 className="text-white text-md font-semibold">Top result</h5>
                 {topResult()}
                 </div>
                 <div className="flex flex-col gap-1 flex-1">
                 <h5 className="text-white text-md font-semibold">Songs</h5>
                   <div className="flex flex-col items-baseline px-2">
                      {Songs()}
                   </div>
                 </div>
             </div>
           
        </div>
      )}
  

     </div>
    )
}

export default Explore