
'use client'
import { useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";

const Song = ({ song, index }) => {
  const [onHovered, setOnHovered] = useState(false);

  return (
    <div
      key={index}
      className={`flex items-center gap-2 cursor-pointer ${
        onHovered ? "opacity-100" : "opacity-90"
      }`}
      onMouseEnter={() => setOnHovered(true)}
      onMouseLeave={() => setOnHovered(false)}
    >
      <div className={`w-8 text-center ${onHovered && 'text-teal-700'}`}>{index + 1}</div>
      <div className="relative">
        <img
          className={`w-10 h-10 ${onHovered ? "opacity-80" : ""}`}
          src={song.image}
          alt={song.name}
        />
        {onHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <BsFillPlayFill className="text-white text-2xl" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold">{song.name}</h3>
        <p className="text-sm text-gray-500">{song.artists}</p>
      </div>
    </div>
  );
};

export default Song;