
import Image from "next/image"
import formatPrice from "../util/PriceFormat"
import { AddCartType } from "@/types/AddCartType"

export default function Product({name,image,price}:AddCartType){
     return (
        <div>
            <Image src={image} alt={image} width={400} height={400}/>
           <h1>{name}</h1>
           {price?formatPrice(price):'N/A'}

       </div>
     )
}