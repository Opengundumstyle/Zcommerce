import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next"

const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
    apiVersion: '2022-11-15'
  });

const limit = 10; // Number of products to fetch per request
let startingAfter:any = null; // Starting point for pagination, initially set to null


export default async function handler(req: NextApiRequest,res: NextApiResponse){
 
    const {q} = req.query
    let allProducts: any[] = []

    // Example: Fetch products in pagination
    while (true) {

        const params = {
           limit: limit,
           ...(startingAfter && { starting_after: startingAfter })
         };
  
       const products = await stripe.products.list(params)
  
       const productWithPrices = await Promise.all(
          products.data.map(async(product)=>{
             const prices = await stripe.prices.list({product:product.id})
             const details = product.metadata.details || ""
             
             return {
                id:product.id,
                name:product.name,
                unit_amount:prices.data[0].unit_amount,
                image:product.images[0],
                currency:prices.data[0].currency,
                description:product.description,
                metadata:{details},
             }
          })
       )
  
       allProducts = allProducts.concat(productWithPrices);
       
        if (!products.has_more) {
           break; // Exit the loop if there are no more pages
        }

   
  
        startingAfter = products.data[products.data.length - 1].id;
       
    // Rate limiting mechanism
     await new Promise((resolve) => setTimeout(resolve, 400)); // Delay between requests to stay within the rate limit
        }

    const search = (p)=>{
         
        let products = []
        
           for(let el of p){
               if(el.name.toLowerCase().includes(q) || el.description?.toLowerCase().includes(q)) {
                products.push(el)
                if(products.length > 10) break
               }
           }
        return products
    }
     
   let queryProducts =  search(allProducts)
  
    res.status(200).json(queryProducts)

  };