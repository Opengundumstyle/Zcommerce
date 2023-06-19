'use client'

import Head from "next/head";
import LayOut from "@/app/layout/layout";
import Link from "next/link";
import styles from '../../../styles/Form.module.css'
import Image from "next/image";
import { useState } from "react";
import { HiAtSymbol,HiEye,HiOutlineUser } from "react-icons/hi";
import { signIn} from "next-auth/react";
import { useFormik } from "formik";
import { registerValidate } from "@/lib/validate";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "@/store";

const SignUpPage= () => {

  const router = useRouter()
  
  const session = useSession()

  const [show,setShow] = useState({password:false,cpassword:false})
  
  const formik = useFormik({
      initialValues:{
         name:"",
         email:"",
         password:"",
         cpassword:""
      },
      validate:registerValidate,
      onSubmit
  })

  async function onSubmit(values:any){
     console.log(values)
     fetch('/api/auth/signup',{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
             ...values
        })
    }).then((res)=>{
     return res.json()
    }).then((data)=>{
         console.log(data)
         router.push('/auth')
    })
     
  }
 

 // Handle Google signin
async function handleGoogleSignIn(){
    session.toggleSession()
    signIn('google',{callbackUrl:'http://localhost:3000'})
}

//Handle Spotify Loin
async function handleSpotifySignIn(){
    session.toggleSession()
    signIn('spotify',{callbackUrl:'http://localhost:3000'})
}                       


  return (
    
  <LayOut>
      <Head>
          <title>Sign In</title>
      </Head>

      <motion.div
       
          className="bg-slate-100">
            <section className="w-3/4 mx-auto flex flex-col gap-10 rounded-r-md">
                <div className="title mt-3">
                        <h3 className="text-teal-700 text-2xl font-semibold pt-7 font-lobster">Register</h3>
                </div>
                {/**form */}

                <form className="flex flex-col gap-5 pt-0" onSubmit={formik.handleSubmit}>
                <div className={`${styles.input_group} ${formik.errors.name && formik.touched.name?'border-rose-500':''}`}>
                        <input 
                        type="text" 
                        name='name'
                        placeholder={`${formik.errors.name && formik.touched.name?`${formik.errors.name}`:'Name'}`}
                        className={styles.input_text}
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        />
                        <span className="icon flex items-center px-4 bg-transparent">
                            <HiOutlineUser size={25}/>
                        </span>
                    </div>

                    <div className={`${styles.input_group} ${formik.errors.email && formik.touched.email?'border-rose-500':''}`}>
                        <input 
                        type="email" 
                        name='email'
                        placeholder={`${formik.errors.email&& formik.touched.email?`${formik.errors.email}`:'Email'}`}
                        className={styles.input_text}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        />
                        <span className="icon flex items-center px-4 bg-transparent">
                            <HiAtSymbol size={25}/>
                        </span>
                    </div>
  
                    <div className={`${styles.input_group} ${formik.errors.password && formik.touched.password?'border-rose-500':''}`}>
                        <input 
                        type={`${show.password?"text":"password"}`}
                        name='password'
                        placeholder="Password"
                        className={styles.input_text} 
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        />
                        <span 
                            className="icon flex items-center px-4 bg-transparent cursor-pointer" 
                            onClick={()=>setShow({...show,password:!show.password})}>
                            <HiEye size={25}/>
                        </span>
                    </div>
                   
                    <div className={`${styles.input_group} ${formik.errors.cpassword && formik.touched.cpassword?'border-rose-500':''}`}>
                        <input 
                        type={`${show.cpassword?"text":"password"}`}
                        name='cpassword'
                        placeholder="Confirm Password"
                        className={styles.input_text} 
                        onChange={formik.handleChange}
                        value={formik.values.cpassword}
                        />
                        <span 
                            className="icon flex items-center px-4 bg-transparent cursor-pointer" 
                            onClick={()=>setShow({...show,cpassword:!show.cpassword})}>
                            <HiEye size={25}/>
                        </span>
                    </div>
            
                    {/**login buttons */}
                    <div className="input-button">
                        <button type="submit" 
                           className={styles.button_signup}
                           >
                            Sign Up
                        </button>
                    </div>
                    <div className="input-button">
                        <button type="button" className={styles.button_custom} onClick={handleGoogleSignIn}>
                            Continue with Google <Image src={'/assets/google.svg'} width={20} height={20} alt="gg"/>
                        </button>
                    </div>
                    <div className="input-button">
                 <button type="button" className={styles.button_custom} onClick={handleSpotifySignIn}>
                      Continue with Spotify <Image src={'/assets/spotify.svg'} width={23} height={23} alt="spotify"/>
                 </button>
              </div>
            
                </form>
                {/**bottom */}
                <p className="text-center text-gray-400 mb-5 text-sm">
                    Have an account? &nbsp;
                    <Link  
                     onClick={()=>!session.onLogin&&session.setLogin()}
                     className="text-teal-700 hover:underline" 
                     href={'/auth'}>
                        Sign In
                    </Link>
                </p>
            </section>
     </motion.div>
  </LayOut>

  );
};

export default SignUpPage



