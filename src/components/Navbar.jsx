import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLogout, setMode, setUser,setPosts } from "../state/index";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import Loader from "./Loader";
import { persistor } from "../state/store";

const Navbar = () => {
  const dispatch = useDispatch();
  const User = useSelector((state) => state.auth.user);
  const mode = useSelector((state) => state.auth.mode);
  const posts = useSelector((state) => state.auth.posts);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (User === null) navigate("/");
  }, [User, navigate]);

  const [dropDown, setdropDown] = useState(false);
  const [edit,setedit] = useState(false);

  if (User === null)
    return (
      <div>
        <Loader />
      </div>
    );

    const submitForm = async (data) => {
      const file = data.dp[0];
      const formData = new FormData();
      formData.append("dp", file);
  
      let res = await fetch(`http://localhost:5000/users/${User._id}/changedp`, {
        method: "PATCH",
        body: formData,
      });
      let result = await res.json();
      if (res.status === 200)
        toast.success("Profile picture updated successfully!", {
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
            dispatch(setUser({ user: result.user }));
          },
        });
      else if (res.status === 404 || res.status === 400)
        toast.error(`update Failed! ${result.message}`, {
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
    <div>
      <nav
        className={`w-screen ${
          mode === "dark" ? "bg-slate-600" : "bg-white"
        } flex justify-between items-center h-[8vh] px-6 py-2 fixed top-0`}
      >
        <Link to="/home">
          <div className="title text-2xl font-bold text-sky-400" >
            Connectify
          </div>
        </Link>
        <div className="options flex gap-6 relative">
          <img
            src={`${
              mode === "dark" ? "/assets/light.svg" : "/assets/dark.svg"
            }`}
            alt="dark-mode"
            width={24}
            className="cursor-pointer"
            onClick={() => {
              dispatch(setMode());
              toast.success(
                `${mode === "dark" ? "Light" : "Dark"} mode activated!`,
                {
                  position: "top-right",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                  transition: Bounce,
                  onClose: () => {},
                }
              );
            }}
          />
          <img
            src="\assets\bell.svg"
            alt="notifications"
            width={24}
            className="cursor-pointer"
          />
          <img
            src={
              dropDown
                ? "/assets/cross.svg"
                : `http://localhost:5000/assets/${User.picturePath}`
            }
            alt="profile"
            className="rounded-full w-8 h-8 cursor-pointer object-cover"
            onClick={() => {
              setdropDown(!dropDown);
              setedit(false);
            }}
          />

          <div
            className={`fixed top-[8vh] right-2 bg-gray-300 p-2 rounded-md shadow-md transform transition duration-300 ease-in-out z-10 ${
              dropDown
                ? "scale-100 opacity-100"
                : "scale-50 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-3 text-sky-400 font-semibold cursor-pointer">
              <Link to={`/profile/${User._id}`} className="hover:text-white">
                Profile
              </Link>
              
              <p
                className="hover:text-white"
                onClick={() => {
                  dispatch(setLogout());
                  
                  toast.success("Logout Successful", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                    onClose: async () => {
                      await persistor.purge();
                    }
                  });
                }} 
              >
                Logout
              </p>

              <form onSubmit={(e) => handleSubmit(submitForm)(e)} className="flex flex-col justify-center">
              <label htmlFor="input" className="hover:text-white cursor-pointer" >{edit?"":"Edit Picture"} 
                <input id="input" className='hidden' type="file" accept="image/*" {...register("dp", { required: "Choose an image" })} onClick={()=>{setedit(!edit)}}/>
              {errors.dp && <p className="text-red-500 mb-3">{errors.dp.message}</p>}
              </label>
              <button
          className={`w-full mx-auto ${edit?'block':'hidden'}  bg-sky-400 text-white p-2 rounded mb-3`}
          type="submit"
          onClick={()=>{setedit(false)}}
        >
          Update
        </button>
              </form>
              <Link to={`/changepass/${User._id}`} className="hover:text-white">
                Change Password
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
