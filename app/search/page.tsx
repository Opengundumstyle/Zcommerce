'use client'

import { useEffect, useState } from "react";
import Product from "../components/Product";
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";

export default function SearchPage() {

   const search = useSearchParams()
   const router = useRouter()
   let  query = search?.get("q")?.replace('%20', ' ').toLowerCase();

   const [products,setProducts] = useState([])
   const [isLoading,setIsLoading] = useState(true)
 
  useEffect(() => {
   
    // setQuery(q);

    const fetchProducts = async()=>{
      try{
        console.log('did i get trigger')
        const response = await fetch(`/api/stripe?q=${query}`)
        const data = await response.json()
        setProducts(data)
   
        }catch(err){
          console.error("Error fetching goods:", err);
        }finally{
           setIsLoading(false)
        }
      }

        if(query){
            fetchProducts()
        }else{
            setProducts([])
            setIsLoading(false)
        } 

        }, [query]);

        if (isLoading) {
          return <Loader/>; // Replace with your loading state component
        }


  return (
    <main className="grid grid-cols-fluid gap-12">

    {products.length > 0 ? products.map(product =>(
       <Product {...product} key={product.id}/>
       )): <div className="mt-40 h-full w-full flex justify-center items-center flex-col"> 
             <h1 className="text-base-700 font-normal text-xl ">Sorry, can't find a match :(</h1>
             <button
      className="mt-6 py-2 px-4 bg-teal-700 text-white rounded-md p-5 hover:bg-slate-400 hover:font-lobster transition-colors duration-500 w-1/6"
      onClick={() => router.push("/")}
    >
      Keep shopping
    </button>
           </div>}
    </main>
  );

}


  
