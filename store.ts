import {create} from 'zustand'
import {persist} from 'zustand/middleware'


type CartItem = {
     name:string,
     id:string,
     images?:string[],
     description?:string,
     unit_amount:number,
     quantity:number
}

type CartState = {
     isOpen:boolean,
     cart:CartItem[]
}
 
const useCartStore = create<CartState>()(
    persist(
      (set, get) => ({
        // Define your store state and actions
        cart: [],
        isOpen:false,
      }),
      {
        name: 'cart-store', // Name for the local storage key
        getStorage: () => localStorage, // Storage mechanism (can be local storage, session storage, etc.)
      }
    )
  );
  
  export default useCartStore;