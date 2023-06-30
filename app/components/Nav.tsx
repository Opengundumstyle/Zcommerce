'use client'

import { Session } from "next-auth"
import {signOut} from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import Cart from "./Cart"

import useCartStore from "@/store"
import { useSession } from "@/store"

import {AnimatePresence, motion} from 'framer-motion'
import Search from "./Search"
import DarkLight from "./DarkLight"
import { useRouter } from "next/navigation"
import {AiFillShopping,AiOutlineHistory} from 'react-icons/ai'
import { IoIosLogOut } from "react-icons/io";

import usePlayer from '@/hooks/usePlayer';
import styles from '../../styles/MusicPlayer.module.css'

export default function Nav({user}:Session){
      
      const cartstore = useCartStore()
      const sessionstore = useSession()
      const router = useRouter()
      const player = usePlayer()
      
      
  
      const handleSession = ()=>{
         if(sessionstore.isSession === false) sessionstore.toggleSession()
         if(sessionstore.onLogin === false) sessionstore.setLogin()
            router.push('/auth')
      }

     const handleLogoClick = ()=>{
          if(sessionstore.isSession === true) sessionstore.toggleSession()
          router.push('/')
     } 

      console.log('what is the current song',player.currentSong)
      console.log('i don get this player wtf',player)


      

      return (
          <nav className="flex justify-between items-center py-12 ">
          
          
                  <motion.h1   
                      initial={{ x: "90%" }}
                      animate={{ x: "calc(10%)" }} 
                      className="font-lobster text-xl cursor-pointer hidden md:block"
                      onClick={handleLogoClick}
                      >
                    Zcommerce
                  </motion.h1>
         

              <div className="flex-1 px-10 hidden md:block">
                 <Search />
              </div>
            
            <ul className="flex items-center gap-8">
                {/**if the user is not signed in */}
            
                <li 
                  onClick={()=>cartstore.toggleCart()}
                  className="flex items-center text-3xl cursor-pointer relative">
                 <AiFillShopping/>
                 {cartstore.cart.length > 0 && (
                  <AnimatePresence>
                    <motion.span 
                       animate={{scale:1}} 
                       initial={{scale:0}} 
                       exit={{scale:0}}
                       className="bg-teal-700 text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center">
                      {cartstore.cart.length}
                    </motion.span>
                  </AnimatePresence>)}
                </li>
              

                {/**Dark Mode */}
                <DarkLight/>
                {!user && (
                        <>{sessionstore.isSession && sessionstore.onLogin? 
                           <li className="bg-teal-600 text-white py-2 px-4 rounded-md min-w-[80px] text-center">
                                <button onClick={handleLogoClick}>Home</button>
                            </li>:
                            <li className="bg-teal-600 text-white py-2 px-4 rounded-md min-w-[80px] text-center">
                                <button onClick={handleSession}>Sign in</button>
                            </li>
                          }
                      </>
                  
                )}
                {
                  user && (
               
                       <li> 
                              <div className="dropdown dropdown-end cursor-pointer">
                                <div tabIndex={0} className="flex flex-col justify-center items-center gap-2">
                                  <Image 
                                    src={user?.image as string || 'https://res.cloudinary.com/dzklgl8gn/image/upload/v1685947029/placeholder_abrdr8.jpg'} 
                                    alt={user.name as string} 
                                    width={36} height={36}
                                    className="rounded-full lg:mt-7 mt-2 w-10 h-10 object-cover"
                                    
                                    /> 
                                    <div className="text-sm hidden lg:block font-lobster">{user.name}</div>
                                  </div>
                                  <ul tabIndex={0} className="dropdown-content menu p-4 space-y-4 shadow bg-base-100 rounded-box w-72">
                                  <li 
                                       className="rounded-md outline-none"
                                       onClick={() => {
                                         if (!player.isOpen) {
                                           if (!player.activeId) player.setId('1');
                                           player.togglePlayer(true);
                                         } else {
                                           player.togglePlayer(false);
                                         }
                                       }}
                                     >
                                       <div className="flex flex-row items-center justify-between gap-0">
                                         Music Player
                                          <div className={`overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[70px] flex-grow` }>
                                            <div className={`${styles.animate_marquee} text-sm text-gray-400`}  style={{ animationDuration: `20s` }}>
                                                  {player.isPlaying && player.currentSong}
                                            </div>
                                         </div> 
                                       
                                         <div className="font-semibold p-0">{player.isOpen ? 'on' : 'off'}</div>
                                       </div>
                                     </li>
                                           
                                 
                                       <Link 
                                         href={'/dashboard'} 
                                         className="hover:bg-base-300 p-4 rounded-md"
                                         onClick={()=>{
                                          if(document.activeElement instanceof HTMLElement){
                                             document.activeElement.blur()}}}>
                                              <div className="flex flex-row justify-between items-center">
                                              Orders 
                                              <AiOutlineHistory className="text-xl"/>
                                              </div>
                                        
                                        </Link>

                                       <li className="rounded-md"
                                           onClick={()=>{
                                              signOut()
                                              if(document.activeElement instanceof HTMLElement){
                                              document.activeElement.blur()}
                                              
                                              }}>
                                                 <div className="flex flex-row justify-between items-center">
                                                   Sign out <IoIosLogOut className="text-xl"/>
                                                 </div>
                                        </li>

                                         
                                  </ul>
                                </div>
                       </li>
             
                    
                  )
                }
            </ul>
            <AnimatePresence>
              {cartstore.isOpen && <Cart user={user}/>}
            </AnimatePresence>
          </nav>
      )
}