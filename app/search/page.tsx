'use client'

import { useEffect, useState } from "react";
import Product from "../components/Product";
import { useSearchParams } from 'next/navigation';


export default function SearchPage() {

   const search = useSearchParams()

   let  query = search?.get("q")

  const [products,setProducts] = useState([])

  console.log('get query',query)
  
  console.log('what are the products',products)

  useEffect(() => {
   
    // setQuery(q);

    const fetchProducts = async()=>{
      try{
        console.log('did i get triggered')
        const response = await fetch(`/api/stripe?q=${query}`)
        const data = await response.json()
        setProducts(data)
   
       
        }catch(err){
          console.error("Error fetching goods:", err);
        }
      }

        if(query){
            console.log('search query')
            fetchProducts()
        }else{
            setProducts([])
        } 



        }, []);



  return (
    <main className="grid grid-cols-fluid gap-12">
    {products.map(product =>(
       <Product {...product} key={product.id}/>
       ))}
    </main>
  );

}


  
