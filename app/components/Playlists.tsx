import Image from "next/image";


const Playlist = ({ playlists }:any) => {
    return (
      <div style={{ overflowY: 'scroll', maxHeight: '300px' }}>
        {playlists.map((playlist, index) => (
         <div>
            <div key={index} className="flex flex-row justify-start items-center gap-7">
                <Image src={playlist.images[0]?.url} alt={playlist.name} width={25} height={25}/>
                <h3>{playlist.name}</h3>
                {/* <p>ID: {playlist.id}</p>
                <p>URL: <a href={playlist.external_urls.spotify}>{playlist.external_urls.spotify}</a></p> */}
            </div>
             
             <hr />

          </div>

          
        ))}
      </div>
    );
  };
  
  export default Playlist;