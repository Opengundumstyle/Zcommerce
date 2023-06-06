'use client'

import useCartStore from "@/store"
import { AddCartType } from "@/types/AddCartType"
import { useState } from "react"
import { toast } from "react-hot-toast"



export default function AddCart({
            name,id,image,unit_amount,quantity}:AddCartType
         ){
      
            const cartStore = useCartStore()
            const [added,setAdded] = useState(false)

            const handleAddToCart =()=>{
      
               cartStore.addProduct({id,image,unit_amount,quantity,name})
               setAdded(true)
              
               setTimeout(()=>{
                  toast.success(`Item added 👏`)
                    setAdded(false)
               },500)
            }

      return(
         <>
           <button
            onClick={handleAddToCart}
            disabled={added}
            className="my-4 btn w-full">
               {!added && <span>Add to cart</span>}
               {added && <span>Adding ... </span>}
          </button>
         </>
      )
}