
import {z} from "zod";

export const registerSchema =  z.object({
     username: z.string().min(3,"Minimum characters must be 3").max(20,"Maximum characters is 20" ),
     email: z.email("please enter a valid email"),
     password: z.string().min(6,"Password must be atleast 6 characters"),
     c_password: z.string().min(6,"Password confirm your password"),
}).refine(
    (data) => data.password === data.c_password,
    {
        message: "Passwords do not match",
        path: ["c_password"],
    }
)

export const loginSchema =  z.object({
     email: z.email("Please enter a valid email"),
     password: z.string().min(6,"Password must be atleast 6 characters"),
})