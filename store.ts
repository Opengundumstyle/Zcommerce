import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import { AddCartType } from './types/AddCartType'



type CartState = {
     isOpen:boolean,
     cart:AddCartType[]
     toggleCart:()=>void
     addProduct:(item:AddCartType) =>void
}
 
const useCartStore = create<CartState>()(
    persist(
      (set, get) => ({
        // Define your store state and actions
        cart: [],
        isOpen:false,
        toggleCart:()=>{
            set((state)=>({isOpen:!state.isOpen}))
          },
        addProduct:(item)=>set((state)=>{
            const existingItem = state.cart.find((cartItem) => cartItem.id === item.id)
            if(existingItem){
               const updatedCart = state.cart.map((cartItem)=>{
                    if(cartItem.id === item.id){
                         return {...cartItem,quantity:cartItem.quantity + 1}
                    }
                    return cartItem
               })
               return {cart:updatedCart}
            }else{
               return {cart:[...state.cart,{...item,quantity:1}]}
            }
        })
      }),

      {
        name: 'cart-store', // Name for the local storage key
        getStorage: () => localStorage, // Storage mechanism (can be local storage, session storage, etc.)
      }
    )
  );
  
  export default useCartStore;