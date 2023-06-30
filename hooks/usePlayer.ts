import {create} from 'zustand'

interface PlayerStore{
     ids:string[]
     activeId?:string
     setId:(id:string)=>void
     setIds:(ids:string[])=>void
     reset:()=>void
     isPlaying:boolean
     setIsPlaying: (play:boolean) => void
     isOpen:boolean
     togglePlayer:(On:boolean) =>void
     uri?:string
     setUri:(val:string)=>void
     favIds:string[]
     setfavIds:(ids:string[])=>void
     isLikedPlaylist:boolean
     setIsLikedPlaylist:(On:boolean)=>void
     isRepeat:number
     setIsRepeat:(val:number)=>void
     isShuffle:boolean
     setIsShuffe:(on:boolean)=>void
     currentSong:string
     setCurrentSong:(val:string)=>void

}


const usePlayer = create<PlayerStore>((set) => {
     const storedCurrentSong = localStorage.getItem('currentSong');
   
     return {
       ids: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
       activeId: undefined,
       setId: (id: string) => set({ activeId: id }),
       setIds: (ids: string[]) => set({ ids: ids }),
       reset: () => set({ ids: [], activeId: undefined }),
       isPlaying: false,
       setIsPlaying: (play: boolean) => set({ isPlaying: play }),
       isOpen: false,
       togglePlayer: (on: boolean) => set({ isOpen: on }),
       uri: '',
       setUri: (val) => set((state) => ({ ...state, uri: val })),
       favIds: [],
       setfavIds: (ids: string[]) => set({ favIds: ids }),
       isLikedPlaylist: true,
       setIsLikedPlaylist: (on: boolean) => set({ isLikedPlaylist: on }),
       isRepeat: 0,
       setIsRepeat: (val) => set({ isRepeat: val }),
       isShuffle: false,
       setIsShuffe: (on: boolean) => set({ isShuffle: on }),
       currentSong: '',
       setCurrentSong: (val: string) => {
         localStorage.setItem('currentSong', val);
         set({ currentSong: val });
       },
     };
   });
   
   export default usePlayer;