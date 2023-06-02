'use client'
import { useEffect, useState,useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import querystring from "querystring";

export default function Search(){

    const [query,setQuery] = useState("")
    const [products,setProducts] = useState([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter()

    useEffect(()=>{
          const fetchProducts = async()=>{
              try{
                const response = await fetch(`/api/stripe?q=${query}`)
                const data = await response.json()
                setProducts(data)
                setIsDropdownOpen(true);
               
              }catch(err){
                console.error("Error fetching goods:", err);
              }
          }

          if(query){
              fetchProducts()
          }else{
              setProducts([])
              setIsDropdownOpen(false)
          }

          const handleClickOutside = (event: { target: any }) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
              setIsDropdownOpen(false);
            }
          };
      
          document.addEventListener("click", handleClickOutside);
      
          return () => {
            document.removeEventListener("click", handleClickOutside);
          };
      

    },[query])


  const handleItemClick = () => {
    setQuery("")
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (query.trim() !== "") {
      const queryString = querystring.stringify({ q: query });
      const url = `/search?${queryString}`;
      router.push(url);
    }
  };

    return(
        <div className="relative w-full" >
        
            <input 
                type="text" 
                placeholder="Got something in mind..?" 
                className="input max-w-lg w-full" 
                onChange={e=>setQuery(e.target.value)}
                value={query}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
                />
            {query && (
                <button
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-base text-gray-500 hover:text-gray-700"
                onClick={handleItemClick}
                >
                Clear
                </button>
            )}
      
          <div className="relative" ref={dropdownRef}>
            {isDropdownOpen && products.length > 0 && (
             <ul className="list-none absolute bg-base-100 shadow-md max-w-lg w-full rounded-md max-h-48 overflow-y-scroll">
                 {products.map((item)=> (
                  
                            <Link
                            key={item.id}
                            href={{
                                pathname: `/product/${item.id}`,
                                query: {
                                image: item.image,
                                name: item.name,
                                unit_amount: item.unit_amount,
                                itemId: item.id,
                                description: item.description,
                                details: item.details,
                                },
                            }}
                            onClick={handleItemClick}
                            >
                            <div 
                              className="flex justify-between px-5 hover:bg-base-200 cursor-pointer" 
                              >
                                <li className="p-3">{item.name}</li>
                                <li >
                                    <Image src={item.image} alt={item.name} width={100} height={100} className="object-cover h-10 w-10 pr-3 "/>
                                </li>
                            </div>
                          </Link>
                        
                     ))}
             </ul>
             )}
             </div>
        </div>
    )

}