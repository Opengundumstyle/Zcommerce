

import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-hot-toast"

const PlaylistModal = ({ playlists,songuri,setOpenModal,spodify}) => {


  const handlePlaylistClick = (playlistId,name) => {
    

      spodify.addTracksToPlaylist(playlistId, [songuri])
      .then(function(data) {
         setOpenModal(false)
         console.log('Added tracks to playlist!');
         toast(`Added song to ${name}`, {
          icon: '🎶',
        });
      }, function(err) {
        console.log('Something went wrong!', err);
      });

  };


  const closeModal = ()=>{
       setOpenModal(false)
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-700 p-8 rounded-lg w-80 opacity-90">
        <h2 className="text-md font-bold mb-1 cursor-pointer hover:bg-slate-600 hover:text-white p-2 rounded-md text-gray-300 " 
            onClick={()=>{}}
         >
             <div className='flex flex-row justify-between items-center'>
               Create Playlist <span> <AiOutlinePlus/></span>
            </div>
           
      </h2>
      <hr />
        <ul className="max-h-48 overflow-y-auto">
          {playlists.map((playlist:any) => (
            <li
              key={playlist.id}
              className="cursor-pointer py-2 hover:bg-gray-500 rounded-sm px-1 text-sm"
              onClick={() => handlePlaylistClick(playlist.id,playlist.name)}
            >
              {playlist.name}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PlaylistModal;