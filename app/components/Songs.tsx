import Song from "./Song";

const Songs = ({ songs,webPlayer,spodify,current_track}) => {




    return (
      <div>
         Your liked songs from <span className="text-teal-700 font-bold"> Spotify</span>
      <div className="overflow-y-auto max-h-64">
        <div className="p-4">
          {songs.map((song, index) => (
             <Song song={song} 
                   index={index} 
                   key={index} 
                   webPlayer={webPlayer} 
                   spodify={spodify} 
                   current_track={current_track} />
          )
          )}
        </div>
      </div>
      </div>
    );
  };
  
  export default Songs;