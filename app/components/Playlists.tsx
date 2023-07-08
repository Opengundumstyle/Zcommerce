'use client'

import Image from "next/image";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactFragment, useState } from "react";
import Playlist from "./Playlist";
import usePlayer from "@/hooks/usePlayer";
import MusicPlayingAnimation from "./MusicPlayingAnimation";
import {AiFillPlayCircle,AiFillPauseCircle } from "react-icons/ai";
import { BsFillPlayFill,BsFillPauseFill,BsPlayCircleFill } from "react-icons/bs";


const Playlists = ({ playlists,spodify,webPlayer,current_track,context,setPlaylistDisplay}:any) => {

  const [openPlaylist,setOpenPlaylist] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedDescription,setSelectedDescription] = useState(null);
  const [selectedName,setSelectedName]= useState(null)
  const [selectedImage,setSelectedImage] = useState(null)
  const [seletedOwner,setSelectedOwner] = useState(null)
  const [selectedTrackNum,setSelectedTrackNum] = useState(null)
  const [isHovered, setIsHovered] = useState(null);

  const player = usePlayer()
  

  console.log('let me see the playlists info',playlists)

  const openPlaylistHandler = (playlistId,description,name,image,owner,tracksNum) => {
        setSelectedPlaylistId(playlistId);
        setSelectedDescription(description)
        setSelectedName(name)
        setSelectedImage(image)
        setSelectedOwner(owner)
        setSelectedTrackNum(tracksNum)
        setOpenPlaylist(true);
  };

    const handlePlaylistPlay = (playlistId: any)=>{
      const playlistURI = `spotify:playlist:${playlistId}`;

      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${spodify.getAccessToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_uri: playlistURI,
        }),
      };

      fetch("https://api.spotify.com/v1/me/player/play", options)
        .then((response) => {
          if (response.ok) {
            console.log("Playlist play request successful");
          } else {
            throw new Error("Playlist play request failed");
          }
        })
        .catch((error) => {
          console.error(error);
        });
 }


  if (openPlaylist) {
    return <Playlist 
            playlistId={selectedPlaylistId} 
            spodify={spodify} 
            webPlayer={webPlayer}
            current_track={current_track}
            context={context}
            setOpenPlaylist={setOpenPlaylist}
            description={selectedDescription}
            name={selectedName}
            image={selectedImage}
            owner={seletedOwner}
            tracksNum={selectedTrackNum}
          />;
  }

   
    return (
      <div style={{ overflowY: 'scroll', maxHeight: '300px'}}>

        {playlists.map((playlist: { id: any; images: { url: any; }[]; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | PromiseLikeOfReactNode | null | undefined; }, index: Key | null | undefined) => (
         <div 
          key={index}
           className={`${!(playlist.uri === context.uri) && 'hover:bg-slate-500 hover:bg-opacity-60'}  ${playlist.uri === context.uri && 'bg-teal-700 bg-opacity-50'} relative`}
           onMouseEnter={() => setIsHovered(playlist.uri)}
           onMouseLeave={() => setIsHovered(null)}
           onClick={() => {
                 player.setIsLikedPlaylist(false)
                 openPlaylistHandler(playlist.id,playlist.description,playlist.name,playlist.images[0].url,playlist.owner,playlist.tracks.total)
                  }  
                }
           >
             {playlist.uri === isHovered&&!(playlist.uri === context.uri) && ( 
             
             <div className="w-12 h-12 absolute right-14 top-1/2 transform -translate-y-1/2 flex justify-center items-center">
               <BsPlayCircleFill className="w-full h-full bg-black rounded-full cursor-pointer hover:scale-110 hover:shadow-lg" 
                 onClick={()=>{
                  player.setIsLikedPlaylist(false)
                  if(!(playlist.uri === context.uri)) handlePlaylistPlay(playlist.id)
                   openPlaylistHandler(playlist.id,playlist.description,playlist.name,playlist.images[0].url,playlist.owner,playlist.tracks.total)
                 }}
               />
           </div>
            
          )}
            <div key={index} className="flex flex-row justify-start items-center gap-5 p-2 font-semibold">
                <Image src={playlist.images[0]?.url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAnFBMVEUSEhIe12Ae3GISAA4RAAsSEBEf3mMRAAgSDhESAA8SCRAf32Me1F8SBg8SCxARAAYct1MdwFcdylsez10dxVkWZDEam0gYeDkZiEAYgT0SFhQXcjcbrU8UOCAcslEZjUIVRSUUNx8WXS4TIxgbpkwal0YVTSgTKhsXdDcYfjwWYDAboUoVSicTKxsUPSIUMh4VVCoTHhcXajMTIBjqnecaAAAMjUlEQVR4nO2dZ3fiOhCGYxU3bFwB0wkdTHG8//+/XcmETUEugGSz9+j5crP3JFgvozIajcZvbxKJRCKRSCQSiUQikUgkEolEIpFIJBKJRNIA+ErTDeEN1tsIIqQhCE3btg1IfiQ/2/r/QqlO5by9J2lvNXJdL8N13Tgazg8LSES3/2GZuA2RM0j6sedbAKgAAOUT8iP5txKEk2l6Jt+ArTfd1gfANoLHtBtSZUouVKg16s8wgv+WSGwiYxa51E4VAKoaxPvFPyRSh9os8pQi2zFUBsvOGzL/gUGJTc3eEnl3qPvbY4PVyXl1Q2KExl1FvV/ep8iW1zHRK2uEaL18xHzfNKphb/CyGk1tPXlO30Wk32+jVxyPbXQeVZs7S1GDFMFX04jRonvX5FlMK5wjs2lNP7BhL3h4fmEClucX6qoYjT2++qhEq++8ihltuOPYQb9Q3eNLmBGjk8vdgBeA0nsBBwBrqSXCgJ8alyZsWKAJV+L0UYnhqdmeCjeieuhfiUrapEQ084Va8KJx2pgXh1EicAh+kxjDdkMC0xrkUdTJwG5CoNOvw4AZwNvUL5EIbNUlkE6pg7r9GyJQ8CT6S6JXc0fFqE4LZhLDRa1WRGltY/CvRLdd46KBkrr1EdRRfUs/PFgNKFTACtUk0NzU4MkwJe7qsSJGbjMCCUkdOw2srWpdJ34Q1DGhok5jFqQTqvgtsX1qZJb5K3Eqeihi2NwgvCB6KGq75gbhhdAQ2k/tccMWJP206wgUiKHXuEKlJbKfol7TfZQSiptP24ugaXUU0BfmvaHuK5hQUayjoLiNeb5vEIIrKuH6Mw+FwlxwZ1SlfZmklmoFoTtaxqtpFPV3hCiarrrxaOL5gdJqqc+JBSchzhtMSvpo1mqfpjsl7x82ygPqf07z4TR2Q+tRnWCkCRCI0SS/NcRsSuiutskiS1kzTD0vP4/8b103YZbmNlgPo5EXPKATzAREbdA6X501mXZObzQb755kPKzbEGnGZj3supZ61wk5WPI3IkZLVhPIt+9G6w+IoPlgpmGmE37M+iPrHlPyH4nmmPldukPsoOfTKIlMpNFMqqoqBUynWpfxaKujcfQvsI2cTRr7lfqrteG8Juo26ylr7ps1HWqDZOW3SkVyd2zg8HapADshC69OVpRkaZVZ0te4frvM6JO4nRo2NH3rFudXtdZcFwzzxOgnU5HhSx2i2aroeBLEXBcMFN0+S+2IjSeQiWcRFeQhBTxzp7Hh3T5BXQsPQevI2OZGnwHPb9iesZ4wrPIEjJ+6ZIGR3QvZdgRdjt8wihgPAd2cgUA8z7adeZ6E7z735Z/ZRYvqenWE++zx6H9w66Y5IURr8XvRxcSnphrMzaGzm67ikeuFvm9RAt/33MkoXkXb/WFjZ79mtys5QzraxEyPMTF4KWwfmd8hiL8v+Ji02ljMOtHS9QHZAaqMDe/nfrjVAr67nA7X5wH9OspVtp01Iw7N0XODnZyRsHM++4mJNPuQdslOSK26FSK/1yI7rqgzg055vixKGJ/qckuzRSyfNGtld0BahzSH7Ax85ZEMYbqx9CfR3Cjx37HGyi5b8BqITpjbQGXZH+7i4LkADO273nStF12CYsX51Dmn9UIfFN7rqXgzplRmyxqlR5Sb/qTdhhi4eVWlARpeAGCNthuNPbrQbTcFE06OG6ov+SkTuUeI0VvR9LYVAaf9hcZcjcSJVK3V8XZ21RixTMBnqsGI4ZQKFmktE/hToz7wGb/HZ83X3xifLVwjmOx/2BHtGB0J9LhMpu33x861AYO7/txba/ZVIzyzGsFpMmW6E4VNyy7Aeu5yNe33eumQkG57/WgVT7wwuFyYrfRJrdHsciOxjY7MTRSn2DesnsNG2h54y2mazBbEj7tsJK5cNhfG4H2973UnNGxY/rFA6Z7oBmXRD9i/7HEJhVU8FiXetrdKZwvjGtVnfth1Y6UfD9s4bJVaEyjeMnZzoxmhwUVh+X0DGvmerm1UOfKNcZtuoNrJ1C2NARcZO+CyRWQtRD+b4Hf3bw6xy73fJ9YN5MAk8kpDh3lY7zziwqVpbEP0TORbJ7Y8d0YPijxwCCmSDX7xQ9ZPX4egpQn+dEYPuPBgzmHJx7DQpVGHXJYkrEPHHpYEgRlP33NY8rFdqDAccAsH6VA7TXOWhTyFPCKKxQrBkmfQFJtoMfTu6Kx1KOQZtKToEM7dyu5dHQrjHIWfQdNvGHauH/DzL6F2mFTUyEchK6L/hWffNLqdeWjGn/Eh6aTDba/X2xHPtJMcxsTh0Sq4BTizY30Ki1cLMP8yYhYQdtB53++OvCCwMif8M1+I+meWFYSTbpTODK2k9A7RmPoVnEU+c2nJih9sLts4nThtb6de7IHCdKBLSNifrDpHE8H84yMMUb987QAJj0NErVgh8Ne0AJTWPuxGfqvqPEiNGo56h4EG85IqsDYuz/Wc8UjJQKVhmsku3cb+/S4Jsac/2r47eWVp4KBMYrDhsRqzTkd/tVR9PGZKk6miscaKrhGJeVlKV3zMQyErSYEvAHi7M6uIUmkQLORycgHnNQQTgTJJ39DNVqhkbwpcLlEM+yBeIG2t6k832q8RyQoDf/8bPh6VXlvuM7C6Z/TDgygJRoOIj89o5B49cQeAePatMI2Oi0O1asrn8Ilx6iMOoMRfhWmYYeDvv8wpQ7FkMPAGWFE2r2JdK73JySXURgOmdy8XnxFuKwj8MKTFIMPQ94mjqlSKfIOgQ5PbPkosSNx+Ttdn2u/VbZgdmPrepNsf7pPTZkBjhg6BOHbG2+J9vR9GSzdUWiUyVX/UnZRu97ltTjGqdHBBU/Qtd9mfZ1FhmjZj6mSb9NmPsvzuLBqsEQd93h95xXnPlULiW15ZUaURU+q3KWS7cCY7ggrbvyzrxljMV95zJ+RgzCsVGpXVTwDu9qQ5ZMt3R1AY67S6aUo89odF+tyqu9qzYoUgcqrk/TDQoWbO4+AxS4IltxRlHRd6NWD1zHE6MeWf/Qg84N3zG4ZlW0Tr/ORwIJZcRPff8bfe+d1IyEv7uuBx2MLoyBh6941I4HLMoy92vnMUkuXBtK9no9l/C6OJRGPnrrJafBPp2RdmPgl+ZmHi7FqTpiH7z2ndoefbhF5v2ElOC7somkiDiPdUJ+S2VlBgUZkBsNO+tCFkLsbz3Yre2GrRa3iXNExVzbIulcCLo85pAdlhNgy1bdUKk2T3y/M6gq4XzqZzx9ZpHHgw60yJtCxAmtsyWvrZjYczXWPksGH0Nq2mUOU4k1JyEzAvrGaDczp1aQZmxexSVfGXvbNzG4HSqxaB43folWGeCqsmUV13Z2DSnMtoc5uNCKsk8HC/n4cdMTfxVdXtHX9nIzKzZX8r5H4rv3hJfAKgWnHyM1EPzkufBfhlQF/RTXHRGgDcxPnW4goJrYBThOY7qCcwlgFUb/+VjFghR4lPKPgnzPRHjrS8ObwcJOnFuREUdSviRlLpLvFJABiNtTbGtlYe+QqElPsuWfV5aLSmC4RO5YUNWj0xl8rQUHglQQCCoPyGLKeUxFswqi/4XQjgcbbNpJZTqHLARFg1rJyqA7VzElfo02RmW9eMuhJR9uOK6BWjCr7QYl/YabpcmwLWYi9Ym8eGBapTkX2UItQ9LQd4nDe+t2DY6HxqzcTX9yTbqOYkqmkdZWgho4JEXQK7Ti1FaBsoBH2htnLQuOaD/b8C/WNdVcsxiptY+K1Tfe8r0YsqmwkjqavYNaVdmhfJHVDLNPqFval5zQDDul/GYtdrRbCtZ534jjmo0YpgKLK0bh72QvR7gr5o6H1BZrtSuc+nAVbS1AuR9ArXSzkI9E/1zqI/Je6EC1TdY5MvJsMoue863f0Cu+0m3oT0TSJciHRvgJI6jb89z4QVD94fQPVmr/AGRB3NBa2MYPrW9LsBL2BodAWcaKj+Wmu8h17RnYS3GYGyMl7DgJ9AmFMY71GBk9PrGPCCjo4rbu9bbXl71OwawaSNTlWv7xaj+j34cq90vmA6sydfPE7PSMOt8QpLRA62diosHFuuz03hC+ujmGjTDyscVDPlgZsCWC9JG6E1rTN4rzzF7ek51eheDmwjc3/PNQMALHc35ln9XDw6RB/Jyq2QjUmvOy+3Y5R33fmF0Q0EF/PpJMi5zXWpKel1t+N2pTKtLwm9F6Npi6Q3HdE6ZkpWX4FmECuBH7rdfnoyHKruH5V3BesGvc5lfLwf5vsOZZ/MNhhq1Srs/jNktU6MzzInl1ttEolEIpFIJBKJRCKRSCQSiUQikUgkEolEIuHMfxoS4nK/OpVUAAAAAElFTkSuQmCC'} 
                   alt={playlist.name} width={80} height={80} className="w-50 h-50 object-contain"/>
                <h3>{playlist.name}</h3>
                {playlist.uri === context.uri && player.isPlaying && <MusicPlayingAnimation/>}
            </div>
             
             <hr />

          </div>
          
        ))}
          <div
                        className='mt-3 
                                  cursor-pointer 
                                  text-gray-400
                                  hover:text-white 
                                  hover:bg-opacity-60
                                  flex 
                                  justify-center
                                  items-center
                                  rounded-sm
                                  py-1
                                  '
                        onClick={()=>{setPlaylistDisplay(false)}}
                        >
                          <span className="py-2 text-md font-normal">My liked songs</span>
                      </div>
      </div>
    );
  };
  
  export default Playlists;