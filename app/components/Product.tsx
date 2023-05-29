
import Image from "next/image"
import formatPrice from "../util/PriceFormat"
import { ProductType } from "@/types/ProducType"
import Link from "next/link"

export default function Product({name,image,unit_amount,id,description,metadata}:ProductType){

      const {details} = metadata

     return (
        <Link  
           href={{pathname:`/product/${id}`,
           query:{image,name,unit_amount,id,description,details}}}
          >
        <div>
                <Image 
                  src={image} 
                  alt={image} 
                  width={400} 
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                  priority={true}
                />

                <div className="font-medium py-2">
                    <h1 >{name}</h1>
                    <h2 className="text-sm text-teal-700"> {unit_amount?formatPrice(unit_amount):'N/A'}</h2>
                </div>
       </div>
       </Link>
     )
}