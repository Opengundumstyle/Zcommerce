import fire from '../../public/fire.json'
import { Player } from "@lottiefiles/react-lottie-player";


export default function FireAnimation(){
      return(
         <div className="flex items-center justify-center flex-col h-9 w-9">
             <Player autoplay loop src={fire}>
             </Player>
         </div>
      )
}
  