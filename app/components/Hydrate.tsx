'use client'

import { useThemeStore } from "@/store"
import { ReactNode,useState,useEffect } from "react"

export default function Hydrate({children}:{children:ReactNode}){
    const [isHydrated,setIsHydrated] = useState(false)
    const themeStore = useThemeStore()
     
    // wait till Nextjs rehydration is completed
     useEffect(()=>{
           setIsHydrated(true)
     },[])

      return(
           <>
             {isHydrated?<body data-theme={themeStore.mode} className="px-4 lg:px-48 font-roboto">{children}</body> : <body></body>}
           </>
      )
}