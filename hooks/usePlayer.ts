import {create} from 'zustand'

interface PlayerStore{
     ids:string[]
     activeId?:string
     setId:(id:string)=>void
     setIds:(ids:string[])=>void
     reset:()=>void
     isPlaying:boolean
     setIsPlaying: (play: boolean) => void;
}


const usePlayer = create<PlayerStore>((set)=>({
     ids:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'],
     activeId:undefined,
     setId:(id:string)=>set({activeId:id}),
     setIds:(ids:string[])=>set({ids:ids}),
     reset:()=>set({ids:[],activeId:undefined}),
     isPlaying:false,
     setIsPlaying: (play: boolean) => set({ isPlaying: play }),
}))


export default usePlayer