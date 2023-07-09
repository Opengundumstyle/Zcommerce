import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "../util/prisma";
import { getServerSession } from "next-auth";
import { format } from "date-fns";
import formatPrice from "../util/PriceFormat";
import Image from "next/image";


export const revalidate = 0

const fetchOrders = async()=>{

    const user = await getServerSession(authOptions)
    if(!user){
      return null
    }
    const orders = await prisma.order.findMany({
      where:{
          userId:user?.user?.id
      },
      include:{ products:true},
  })
    return orders

}

export default async function Dashboard(){

    const orders  = await fetchOrders( )
    
    if(orders === null)return <div>You need to be logged in to view your orders 👮🏽‍♀️</div>

    if(orders.length === 0 ) return <div className="h-3/5 w-full flex justify-center items-center flex-col"> 
                                 
                                     <h1 className="text-slate-400 font-normal text-2xl ">You have no orders yooo</h1>
                                     <div className="p-2 text-gray-600 text-sm"> didn't see your order? Try refresh</div>
                                    </div>

    return (

          <div>
           <h1 className="text-bold">Your Orders</h1>
           <div className="font-medium">
               {orders.reverse().map((order)=>(
                   <div key={order.id} className="rounded-lg p-8 my-4 space-y-2 bg-base-200">
                       <h2 className="text-xs font-medium">Order reference: {order.id}</h2>
                       
                       <p className="text-xs py-2 ">
                         Status: <span 
                          className={`${order.status === 'complete'?"bg-teal-500":"bg-orange-500"} text-white py-1 rounded-md px-2 mx-2 text-sm`}>
                            {order.status}
                            </span>
                        </p>
                        <p className="text-xs">{format(order.create, "MMM dd, yyyy HH:mm")}</p>

                        <div className="text-sm lg:flex items-baseline gap-2">  
                            {order.products.map((product)=>(
                                <div className="py-2" key={product.id}>
                                       <h2 className="py-2">{product.name}</h2>
                                       <div className="flex items-center gap-4">
                                          <Image src={product.image!} width={36} height={36} alt={product.name} priority={true}/>
                                          <p>{formatPrice(product.unit_amount)}</p>
                                          <p>Quantity: {product.quantity}</p>
                                       </div>
                                </div>
                            ))}
                        </div>
                        <p className="font-medium ">
                             Total:{formatPrice(order.amount)}
                        </p>
                       
                   </div>
               ))}
           </div>
          </div>
    )
}