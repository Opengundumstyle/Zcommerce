export default function login_validate(values){
    const errors = {};

      // validation for email
         if (!values.email) {
           errors.email = 'Required';
         } else if (
           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
         ) {
           errors.email = 'Invalid email address';
         }
     

     // validation for password
     if(!values.password){
         errors.password = "Required"
     }else if(values.password.length < 8 || values.password.length > 20){
            errors.password = 'Must be greater than 8 and less than 20 characters long'
     }else if(values.password.includes(" ")){
         errors.password = 'Invalid Password'
     }

     return errors
} 



export function registerValidate(values){

  const errors = {}

  // check name
  if(!values.name){
     errors.name = "Required"
  }else if(values.name.includes(" ")){
     errors.name = "Invalid username...!"
  }
  //check email
  if (!values.email) {
    errors.email = 'Required';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address';
  }

  //check password
  if(!values.password){
    errors.password = "Required"
  }else if(values.password.length < 8 || values.password.length > 20){
        errors.password = 'Must be greater than 8 and less than 20 characters long'
  }else if(values.password.includes(" ")){
      errors.password = 'Invalid Password'
  }


  // check confirm password
  if(!values.cpassword){
     errors.cpassword = 'Required'
  }else if(values.password !== values.cpassword){
     errors.cpassword = "Password Not Match...!"
  }else if(values.password.includes(" ")){
     errors.cpassword = "invalid Confirm Password"
  }

  

  return errors

  
}