'use client'

import { useEffect, useState } from "react";
import Product from "../components/Product";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products,setProducts] = useState([])
  const url = new URL(window.location.href);
 

  useEffect(() => {
    const queryParams = new URLSearchParams(url.search);
    const q = queryParams.get("q") || "";
    setQuery(q);


    const fetchProducts = async()=>{
      try{
        const response = await fetch(`/api/stripe?q=${query}`)
        const data = await response.json()
        setProducts(data)
   
       
        }catch(err){
          console.error("Error fetching goods:", err);
        }
      }

        if(query){
            fetchProducts()
        }else{
            setProducts([])
        }


        }, [url,query]);



  return (
    <main className="grid grid-cols-fluid gap-12">
    {products.map(product =>(
       <Product {...product} key={product.id}/>
       ))}
    </main>
  );
}


  
