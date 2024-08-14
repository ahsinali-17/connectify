import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from "../state/index";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const Login = () => {
  const [showpass, setshowpass] = useState(false);
  const dispatch = useDispatch();
  const User = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (User !== null) navigate("/home");
  }, [User]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const submitForm = async (data) => {
    let res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });
    let result = await res.json();
    if (result.user) {
      dispatch(setLogin(result));
      toast.success("Login Successful", {
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
    }
    if (res.status === 400 || res.status === 500)
      toast.error(`Authentication failed! Error:${result.message}`, {
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
    reset();
  };

  return (
    <div className="container mx-auto mt-6">
      <h3 className="font-bold text-xl text-gray-600 text-center mb-6">
        Welcome Back!
      </h3>
      <form
        className="bg-gray-300 lg:w-[50%] md:w-[75%] w-full max-h-[80vh] mx-auto p-6"
        onSubmit={(e) => handleSubmit(submitForm)(e)}
      >
        <div className="name flex gap-6 mb-3"></div>
        <input
          className="p-2 w-full mb-3 outline-none"
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

        <div className="flex items-center gap-3 bg-white mb-3 pr-3">
          <input
            className="p-2 w-full outline-none"
            type={`${showpass ? "text" : "password"}`}
            autoComplete="off"
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
        <button
          className="w-full bg-sky-400 text-white p-2 rounded mb-3"
          type="submit"
        >
          Login
        </button>
        <p className="text-sm text-center">
          Don't have an account?{" "}
          <span
            className="text-red-500 cursor-pointer font-bold"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
