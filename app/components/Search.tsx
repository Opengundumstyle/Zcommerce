'use client'
import { useEffect, useState } from "react"


export default function Search(){

    const [query,setQuery] = useState("")
    const [products,setProducts] = useState([])

    useEffect(()=>{
          const fetchProducts = async()=>{
              try{
                const response = await fetch(`/api/stripe?q=${query}`)
                const data = await response.json()
                setProducts(data)
               
              }catch(err){
                console.error("Error fetching goods:", err);
              }
          }

          if(query.length){
              fetchProducts()
          }else{
              setProducts([])
          }
      

    },[query])
      
     
    return(
        <div className="relative w-full">
             
           <input 
               type="text" 
               placeholder="Got something in mind..?" 
               className="input max-w-lg w-full" 
               onChange={e=>setQuery(e.target.value)}

               />
             <ul className="list-none absolute  bg-base-100 shadow-md max-w-lg w-full rounded-md">
                 {products.map((item)=> <li className="p-3">{item.name}</li>)}
             </ul>
        </div>
    )

}