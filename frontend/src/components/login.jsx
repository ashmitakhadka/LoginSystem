
import { Link , useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
import { useState } from "react";

const Login = ()=>{
     
     const{register, handleSubmit, formState:{errors}} = useForm({
        resolver: zodResolver(loginSchema)
     })
       const navigate = useNavigate();

     const[loading, setLoading] = useState(false);

      async function onSubmit(data) {
     setLoading(true)
     try{
         const response= await fetch ('http://127.0.0.1:8000/api/login',{
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(data),
         })
          const result = await response.json()
         if(!response.ok){
             console.log(result);
             throw new Error(result.message||"Submission failed");
         }
         alert(result.message);
         localStorage.setItem("token", result.token);
         
         if (result.user && result.user.role === 'admin') {
             navigate("/admin-dashboard");
         } else {
             navigate("/dashboard");
         }

     }catch(error){
          console.log("Error posting data", error)
     }finally{
         setLoading(false);
     }
  }
   
      return(
        <div className="bg-gray-200 flex justify-center items-center min-h-screen ">
            <form onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))} className="bg-white p-8 rounded-lg gap-4 flex flex-col mt-20 w-120 mb-20">
            
                <label htmlFor="email"  className="font-semibold"> Email</label>
                <input type="text"  name="email" id="email"
                 placeholder="Enter you email" 
                 className="border border-gray-200 rounded-md p-2
                focus:outline-none focus:ring-1" {...register('email')}/>
                {errors.email && (<span className="text-sm text-red-500"> {errors.email.message}</span>)}

                <label htmlFor="password" className="font-semibold" >Password</label>
                <input type="password" name="password" id="password"
                 placeholder="Enter your password" 
                 className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1"  {...register('password')}/>
                   {errors.password && (<span className="text-sm text-red-500"> {errors.password.message}</span>)}


                <button type="submit" 
                className="bg-blue-300 p-2 w-45  rounded-md focus:ring-blue-500 hover:bg-blue-600 self-center">Login</button>
                <p className="flex justify-center gap-2">
                    Don't have an account yet?
                    <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                </p>
            </form>
        </div>
      )
}

export default Login