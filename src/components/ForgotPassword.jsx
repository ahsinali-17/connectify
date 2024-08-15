import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, Bounce } from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const Navigate = useNavigate()
  return (
    <div className="lg:w-1/3 w-[75%] mx-auto my-6">
    <label htmlFor='forgot' className="font-bold text-xl text-sky-400">
      Enter your Email
    </label>
        <input id='forgot' type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} required className="w-full h-10 p-3 bg-gray-100 rounded-2xl my-3"/>
        <button className="bg-sky-400 text-white px-4 py-2 rounded-full mr-6" onClick={async ()=>{
            const res = await fetch('http://localhost:5000/password/forgotpass',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
            })
            const data = await res.json()
        if(res.status === 200){
            toast.success("Password reset email sent!", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
              });
        }
        else if(res.status === 404 || res.status === 500)
        toast.error(`${data.message}`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }}>Submit</button>
        <button className="bg-sky-400 text-white px-4 py-2 rounded-full" onClick={()=>{Navigate('/')}}>Back to Login Page</button>
    </div>
  )
}

export default ForgotPassword 