'use client'

import { ReactNode,useState,useEffect } from "react"

export default function Hydrate({children}:{children:ReactNode}){
    const [isHydrated,setIsHydrated] = useState(false)
     
    // wait till Nextjs rehydration is completed
     useEffect(()=>{
           setIsHydrated(true)
     },[])

      return(
           <>
             {isHydrated?<>{children}</> : <div>Loading...</div>}
           </>
      )
}