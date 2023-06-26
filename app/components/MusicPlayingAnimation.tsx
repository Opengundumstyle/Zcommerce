
import { Player } from "@lottiefiles/react-lottie-player";
import musicPlaying from '@/public/music.json'


export default function MusicPlayingAnimation(){
    return(
         <div className="w-10 h-10 text-teal-100">
             <Player autoplay loop src={musicPlaying}>
             </Player>
         </div>
    )
}