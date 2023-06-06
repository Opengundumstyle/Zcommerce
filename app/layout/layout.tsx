import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store';
import styles from '../../styles/Layout.module.css'

import useCartStore from '@/store';

interface LayOutProps {
  children: ReactNode;
}

const LayOut = ({ children }: LayOutProps) => {

 const themeStore = useThemeStore()
 const cartStore = useCartStore()

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
  );
};

export default LayOut;