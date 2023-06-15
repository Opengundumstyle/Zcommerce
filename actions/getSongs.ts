
import { Song } from "@/types/SongType"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import {cookies} from 'next/headers'

const getSongs = async ():Promise<Song[]>=>{
      const supabase = createServerComponentClient({
         cookies:cookies
      })
 
      const {data,error} = await supabase.from('songs').select('*').order('created_at',{ascending:false})

       console.log('what are he datas',data)

      if(error) console.log(error) 

      return (data as any) || []

}


export default getSongs

