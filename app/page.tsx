import Stripe from "stripe"
import Product from "./components/Product"


const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  apiVersion: '2022-11-15',

});

export const getProducts = async () => {
  const limit = 10; // Number of products to fetch per request
  let allProducts: any[] = [];

  let startingAfter: any = null; // Starting point for pagination, initially set to null

  while (true) {
    const params = {
      limit: limit,
      ...(startingAfter && { starting_after: startingAfter }),
    };

    const products = await stripe.products.list(params);

    const productWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({ product: product.id });
        const details = product.metadata.details || '';

        return {
          id: product.id,
          name: product.name,
          unit_amount: prices.data[0].unit_amount,
          image: product.images[0],
          currency: prices.data[0].currency,
          description: product.description,
          metadata: { details },
        };
      })
    );

    allProducts = allProducts.concat(productWithPrices);

    if (!products.has_more) {
      break; // Exit the loop if there are no more products to fetch
    }

    startingAfter = products.data[products.data.length - 1].id;

    // Rate limiting mechanism
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay between requests to stay within the rate limit
  }

  return allProducts;
};

export default async function Home() {

  const products = await getProducts()
  
  return (
    <main className="grid grid-cols-fluid gap-12">
        {products.map(product =>(
           <Product {...product} key={product.id}/>
           ))}
    </main>
  )
}
