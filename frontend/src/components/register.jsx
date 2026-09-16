
import { useForm } from "react-hook-form"
import {  useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "../schemas/registerSchema"
import { useNavigate } from "react-router-dom";

const Register= ()=>{

    const { register, handleSubmit, formState:{errors}} = useForm({
           resolver: zodResolver(registerSchema)
    })
   
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const onSubmit = async (formData)=>{
   
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // 'data' contains all form field values
      });

       const result = await response.json();

       if (!response.ok) {
                console.log(result);
                throw new Error(result.message || "Submission failed");
      }

      alert(result.message);
      navigate('/login');

    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setLoading(false);
    }   
    console.log(formData);
   }
    return(
        <div className="bg-gray-200 flex justify-center items-center min-h-screen">
             <form  className="bg-white p-8 rounded-[30px] gap-4 flex flex-col mt-20 w-120 mb-20" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="username" className="font-semibold">Username</label>
                <input type="text" id="username"name="name" 
                placeholder="Enter your username" 
                className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1" {...register("username")}/>
                {errors.username && (<span className="text-red-500 text-sm">{errors.username.message}</span>)}

                <label htmlFor="password" className="font-semibold">Password</label>
                <input type="password" name="password" id="password" 
                placeholder="Enter your password" 
                className="border border-gray-200 rounded-md p-2
                focus:outline-none focus:ring-1" {...register("password")}/>
                {errors.password && (<span className="text-red-500 text-sm">{errors.password.message}</span>)}
                

                <label htmlFor="c_password"  className="font-semibold">Confirm Password</label>
                <input type="password" name="c_password" id="c_password" 
                placeholder="Confirm Password" 
                className="border border-gray-200 rounded-md p-2
                focus:outline-none focus:ring-1" {...register("c_password")}/>
                {errors.c_password && (<span className="text-red-500 text-sm">{errors.c_password.message}</span>)}

                <label htmlFor="email"  className="font-semibold"> Email</label>
                <input type="text"  name="email" id="email" 
                placeholder="Enter you email" 
                className="border border-gray-200 rounded-md p-2
                focus:outline-none focus:ring-1"  {...register("email")} />
                {errors.email && (<span className="text-red-500 text-sm">{errors.email.message}</span>)}

                <button type="submit" 
                className="bg-blue-300 p-2 w-45  rounded-md focus:ring-blue-500 hover:bg-blue-600 self-center">Register</button>
            </form>
        </div>
    )
}

export default Register