'use client'

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store';
import styles from '../../styles/Layout.module.css'
import { useRouter } from 'next/navigation';
import { useSession } from '@/store';
import useCartStore from '@/store';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface LayOutProps {
  children: ReactNode;
}

const LayOut = ({ children }: LayOutProps) => {

 const themeStore = useThemeStore()
 const cartStore = useCartStore()
 const router = useRouter()
 const sessionStore = useSession()


 const handleDemoLogin = async()=>{
  const status =  await signIn('credentials',{
    redirect:false,
    email:'Demo@gmail.com',
    password:'12345678',
    callbackUrl:'/'
})

if(status?.ok){
     
    router.refresh()
    router.push('/')
    sessionStore.toggleSession()
    setTimeout(() => {
      toast.success('Logged In')
    }, 300);
} 

if(status?.error){
     toast.error(status.error)
}
 }

 if (cartStore.isOpen) {
  return (
    <div className="flex justify-center items-center h-4/6 w-2/3">
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold text-base-900 font-lobster">Sign in to Buy</h2>
        <p className="text-gray-600 mt-4">Please sign in to proceed with your purchase.</p>
      </div>
    </div>
  );
}
  return (
    <div className='flex flex-col'>
      <div className='mb-5 text-center'> 
      <span className='font-sans hover:bg-base-700 hover:text-teal-700 font-semibold cursor-pointer p-1 pl-2 rounded-md transition-all duration-300 gap-1 hover:text-lg' 
             onClick={handleDemoLogin}>
        Use Demo </span>
        instead
      </div>
      <motion.div
        initial={{ y: '100vh', x: '20wh' }}
        animate={{ y: 0, x:0, rotate: 0, originX: 0.5, originY: 0.5 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        
      >
        <div className=' m-auto bg-teal-700 rounded-lg w-4/5 h-auto grid lg:grid-cols-2  '>
          
          <div className={`flex ${themeStore.mode === 'light'? `${styles.imgStyle}`:`${styles.imgNightStyle}`}`}>
            
              <div className={styles.cartoonImg}></div>
              <div className={styles.cloud_one}></div>
              <div className={styles.cloud_two}></div>
              

          </div>

          <div className='right flex flex-col justify-evenly rounded-r-md '>
                <div className='text-center py-4.5 '>
                  {children}
                </div>
          </div>
        </div>
        
      </motion.div>
    </div>
  );
};

export default LayOut;