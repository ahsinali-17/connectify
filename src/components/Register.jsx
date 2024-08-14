import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const Register = () => {
  const [showpass, setshowpass] = useState(false);
  const User = useSelector((state) => state.auth);
  useEffect(() => {
    if (User.user) navigate("/home");
  }, [User]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submitForm = async (data, e) => {
    e.preventDefault();
    const file = data.file[0];

    const formData = new FormData(); //sets header to multipart/form-data neccessary for multer
    formData.append("picture", file);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("location", data.location);
    formData.append("occupation", data.occupation);

    let res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      body: formData,
    });
    let result = await res.json();
    if (result.user)
      toast.success("User registered", {
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
          navigate("/");
        },
      });
    if (res.status >= 500 || res.status === 400) {
      toast.error(`Registeration failed! Error:${result.error}`, {
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
          navigate("/register");
        },
      });
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <h3 className="font-bold text-xl text-gray-600 text-center mb-6">
        Get started with Connectify!
      </h3>
      <form
        className="bg-gray-300 lg:w-[50%] md:w-[75%] w-full max-h-[80vh] mx-auto p-6"
        onSubmit={(e) => handleSubmit(submitForm)(e)}
      >
        <div className="name flex gap-6 mb-3">
          <input
            className="outline-none text-black w-1/2 p-2"
            {...register("firstName", { required: true })}
            placeholder="FirstName*"
          />
          {errors.firstName && <p className="text-red-500 mb-3"> required</p>}
          <input
            className="outline-none text-black w-1/2 p-2"
            {...register("lastName", { required: true })}
            placeholder="LastName*"
          />
          {errors.lastName && <p className="text-red-500 mb-3"> required</p>}
        </div>
        <input
          className="p-2 w-full mb-3"
          {...register("email", {
            required: " required",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Entered value does not match email format",
            },
          })}
          placeholder="Email*"
        />
        {errors.email && (
          <p className="text-red-500 mb-3">{errors.email.message}</p>
        )}
        <div className="flex items-center gap-3 mb-3 bg-white pr-3">
          <input
            className="outline-none p-2 w-full"
            type={`${showpass ? "text" : "password"}`}
            {...register("password", {
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
            placeholder="Password*"
          />
          <img
            src={showpass ? "/assets/eyeclosed.svg" : "/assets/eye.svg"}
            alt="show password"
            className="cursor-pointer w-6 h-6"
            onClick={() => setshowpass(!showpass)}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 mb-3">{errors.password.message}</p>
        )}
        <input
          className="outline-none p-2 w-full mb-3"
          {...register("location", { required: true })}
          placeholder="Location*"
        />
        {errors.location && <p className="text-red-500 mb-3"> required</p>}
        <input
          className="outline-none p-2 w-full mb-3"
          {...register("occupation")}
          placeholder="Occupation"
        />

<div className="flex flex-col items-center my-4">
          <label
            htmlFor="default_size"
            className="cursor-pointer flex flex-col items-center justify-center w-20 h-20 bg-gray-100 rounded-full border-2 border-dashed border-gray-400 hover:bg-gray-200"
          >
            <img src="/assets/plus.svg" />
            <input
              className="hidden"
              id="default_size"
              type="file"
              accept="image/*"
              {...register("file", { required: true })}
            />
          </label>
          <span className="mt-2 text-md text-gray-600">
            Add Profile Picture
          </span>
        </div>
        {errors.file && <p className="text-red-500 mb-3"> required</p>}
        <button
          className="w-full bg-sky-400 text-white p-2 rounded mb-3"
          type="submit"
        >
          Register
        </button>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-red-500 cursor-pointer font-bold"
            onClick={() => {
              navigate("/");
            }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
