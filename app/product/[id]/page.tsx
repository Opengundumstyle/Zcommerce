// 'use client'

import Image from "next/image"
import { SearchParamTypes } from "@/types/SearchParamTypes"
import formatPrice from "@/app/util/PriceFormat"
import AddCart from "./AddCart"

export default async function Product({searchParams}:SearchParamTypes){
  
    return( 
      <div className="flex flex-col xl:flex-row items-center justify-between gap-24 ">
         <Image   src={searchParams.image} 
                  alt={searchParams.name} 
                  width={600} 
                  height={600}
                  className="w-full"
                  priority={true}
                />
        <div>
            <h1 className="text-2xl font-medium py-2">{searchParams.name}</h1>
            <p className="py-2">{searchParams.description}</p>
            <p className="py-5">{searchParams.details}</p>
        <div className="flex gap-2">
              <p className="font-bold text-teal-700">{searchParams.unit_amount && formatPrice(searchParams.unit_amount)}</p>
        </div>
 
          <AddCart id={searchParams.itemId} 
                   image={searchParams.image} 
                   name={searchParams.name} 
                   unit_amount={searchParams.unit_amount} 
                   />

        </div>
     </div>
     )
}







