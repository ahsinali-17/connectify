import React,{useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast, Bounce } from "react-toastify";
import { useForm } from "react-hook-form";

const ResetPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

    const [showpass, setshowpass] = useState(false);
    const navigate = useNavigate()
    const {token} = useParams()

    const submitForm = async (data) => {
      const { newpass } = data;
  
      let res = await fetch("http://localhost:5000/password/resetpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newpass , token }),
      });
      let result = await res.json();
      if (res.status === 200) {
        toast.success("Password has been changed!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
          onClose: () => {
            navigate("/home");
          },
        });
      } else if (res.status === 400)
        toast.error(`${result.message}`, {
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
      reset();
    };

  return (
    <div className="lg:w-1/3 w-[75%] mx-auto my-6 p-3">
      <h1 className="text-2xl font-bold mb-3 text-gray-500">Change Password</h1>
      <form onSubmit={(e) => handleSubmit(submitForm)(e)}>
        <div className="flex items-center gap-3 bg-white mb-3 pr-3">
          <input
            className="p-2 w-full outline-none"
            type={`${showpass ? "text" : "password"}`}
            autoComplete="off"
            {...register("newpass", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
              },
            })}
            placeholder="Enter New password*"
          />
          <img
            src={showpass ? "/assets/eyeclosed.svg" : "/assets/eye.svg"}
            alt="show password"
            className="cursor-pointer w-6 h-6"
            onClick={() => setshowpass(!showpass)}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 mb-3">{errors.oldpass.message}</p>
        )}
        <button className="bg-sky-400 text-white px-4 py-2 rounded-full mr-6" type='submit'>Set Password</button>
        </form>
    </div>
  )
}

export default ResetPass