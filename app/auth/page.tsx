'use client'

import Head from "next/head";
import LayOut from "../layout/layout";
import Link from "next/link";
import styles from '../../styles/Form.module.css'
import Image from "next/image";
import { useState } from "react";
import { HiAtSymbol,HiEye } from "react-icons/hi";
import { signIn} from "next-auth/react";
import { useFormik } from "formik";
import login_validate from "@/lib/validate";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast'
import { useSession } from "@/store";
import { AiOutlineLogin } from "react-icons/ai";

const AuthPage = () => {

  const [show,setShow] = useState(false)
  const sessionStore = useSession()
  const router  = useRouter()

  const formik = useFormik({
     initialValues:{
        email:"",
        password:"",
     },
     validate:login_validate,
     onSubmit
  })

  async function onSubmit(values: any){

    const status =  await signIn('credentials',{
          redirect:false,
          email:values.email,
          password:values.password,
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


  // Handle Google signin
  async function handleGoogleSignIn(){
      signIn('google',{callbackUrl:'http://localhost:3000'})
  }

  // Handle gihub login
  async function handleGithubSignIn(){
   signIn('github',{callbackUrl:'http://localhost:3000'})
}

  return (
    
  <LayOut>
      <Head>
          <title>Sign In</title>
      </Head>
     <section className={`w-3/4 mx-auto flex flex-col gap-10 rounded-r-md`}>
          <div className="title mt-3">
                <h3 
                  className="text-slate-100 text-2xl font-bold py-7 pb-3 font-lobster cursor-pointer"
                   onClick={()=>{
                      if(sessionStore.isSession)sessionStore.toggleSession()
                      if(sessionStore.onLogin) sessionStore.setLogin()
                      router.push('/')}}
                  >Explore</h3>
                <p className="w-full mx-auto text-gray-400 text-sm">Zcommerce is a trendy fashion ecommerce store that offers a wide range of stylish clothing and accessories for fashion-forward individuals</p>
          </div>
          {/**form */}
          <form className="flex flex-col gap-5 " onSubmit={formik.handleSubmit}>
              <div className={styles.input_group}>
                 <input 
                  type="email" 
                  name='email'
                  placeholder="Email"
                  className={styles.input_text}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                 />
                 <span className="icon flex items-center px-4 bg-transparent">
                    <HiAtSymbol size={25}/>
                 </span>
              </div>
              {(formik.errors.email && formik.touched.email)?<span className="text-base-500 text-xs">{formik.errors.email}</span>:<></>}
              <div className={styles.input_group}>
                 <input 
                  type={`${show?"text":"password"}`}
                  name='password'
                  placeholder="password"
                  className={styles.input_text} 
                  onChange={formik.handleChange}
                  value={formik.values.password}
                 />
                 <span 
                    className="icon flex items-center px-4 bg-transparent cursor-pointer" 
                    onClick={()=>setShow(!show)}>
                    <HiEye size={25}/>
                 </span>
              </div>
              {formik.errors.password && formik.touched.password?<span className="text-base-500 text-xs">{formik.errors.password}</span>:<></>}
              {/**login buttons */}
              <div className="input-button">
                 <button type="submit" className={styles.button}>
                        <div className="flex flex-row justify-center items-center">
                           
                            Sign In 
                      
                        <AiOutlineLogin className="pl-3 w-10 h-auto"/>
                       </div>
                 </button>
              </div>
              <div className="input-button">
                 <button type="button" className={styles.button_custom} onClick={handleGoogleSignIn}>
                      Continue with Google <Image src={'/assets/google.svg'} width={20} height={20} alt="gg"/>
                 </button>
              </div>
              <div className="input-button">
                 <button type="button" className={styles.button_custom} onClick={handleGithubSignIn}>
                      Continue with GitHub <Image src={'/assets/github.svg'} width={20} height={20} alt="git"/>
                 </button>
              </div>
          </form>
           {/**bottom */}
           <p className="text-center text-gray-400 pb-5 text-sm">
               don't have an account yet? &nbsp;
               <Link  
                className="text-base-100 hover:underline " 
                href={'auth/register'}
                onClick={()=>sessionStore.onLogin&&sessionStore.setLogin()}>
                  Sign Up
               </Link>
           </p>
     </section>
  </LayOut>

  );
};

export default AuthPage;