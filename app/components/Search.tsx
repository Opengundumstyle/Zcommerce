'use client'
import { useEffect, useState,useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import querystring from "querystring";
import FireAnimation from "./FireAnimation"


export default function Search(){

    const [query,setQuery] = useState("")
    const [products,setProducts] = useState([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter()
    const [isHovered, setIsHovered] = useState(false);
    const [selected,setSelected] = useState("")

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

 // reset input when user select items
  const handleItemClick = () => {
    setQuery("")
    setIsDropdownOpen(false);
  };
 // redirect to new page when user hit enter
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
          
            <div className={`flex flex-row border-2 rounded-lg p-2 hover:border-teal-700 items-center transition-all duration-200 ${query?'border-teal-700':'border-transparent' }`}
                 
                 >
              <input 
                  type="text" 
                  placeholder="Got something in mind..?" 
                  className="input max-w-lg w-full border-none focus:outline-none" 
                  onChange={e=>setQuery(e.target.value)}
                  value={query}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(e);
                    }
                  }}
                  />
               
                    <motion.div 
                     initial={{ x: "90%" }}
                     animate={{ x: "calc(10%)" }} 
                      className="absolute top-0 right-0 h-full flex items-center mr-2">
                          {(isHovered)&&(!query)&& (<FireAnimation/>)}
                      
                       </motion.div>
                    </div>
         
           
            {query && (
                <button
                className={`absolute top-1/2 right-3 transform -translate-y-1/2 text-base text-gray-500 hover:text-gray-700 mr-2 transition-all duration-600 ease-in`}
                onClick={handleItemClick}
                >
                Clear
                </button>
            )}
      
          <div className="relative" ref={dropdownRef}>
            {isDropdownOpen && products.length > 0 && (
             <ul className="list-none absolute bg-base-100 shadow-md w-full rounded-md max-h-48 overflow-y-auto">
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
                              onMouseEnter={()=>setSelected(item.id)}
                              onMouseLeave={()=>setSelected("")}
                              >
                                <li className="p-3">{item.name}</li>
                                {selected === item.id && <FireAnimation/>}
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