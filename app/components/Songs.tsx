

const Songs = ({ songs }) => {
    return (
      <div className="overflow-y-auto max-h-64">
        <div className="p-4">
          {songs.map((song, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-8 text-center">{index + 1}</div>
              <div className="flex items-base gap-4">
                <img className="w-10 h-10" src={song.image} alt={song.name} />
                <div>
                  <h3 className="font-bold">{song.name}</h3>
                  <p className="text-sm text-gray-500">{song.artists}</p>
                </div>
              </div>
            
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Songs;