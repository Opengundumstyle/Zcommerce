import Song from "./Song";

const Songs = ({ songs }) => {
    return (
      <div className="overflow-y-auto max-h-64">
        <div className="p-4">
          {songs.map((song, index) => (
             <Song song={song} index={index}/>
          )
          )}
        </div>
      </div>
    );
  };
  
  export default Songs;