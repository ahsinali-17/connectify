import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "../state/index";
import { useForm } from "react-hook-form";
import { toast, Bounce } from "react-toastify";

const AddPost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const User = useSelector((state) => state.auth.user);
  const mode = useSelector((state) => state.auth.mode);
  const token = useSelector((state) => state.auth.token);

  const [showImgInput, setshowImgInput] = useState(false);
  const [showVidInput, setshowVidInput] = useState(false);

  const submitForm = async (data) => {
    console.log(data.file)
    const file = data.file.length !== 0 ? data.file[0] : "";
    const vid = data.vid.length !== 0 ? data.vid[0] : "";
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("image", file);
    formData.append("video", vid);
    formData.append("userId", User._id);

    let res = await fetch("http://localhost:5000/addpost", {
      method: "POST",
      body: formData,
    });
    let result = await res.json();
    if (res.status === 200){
      Navigate(`/profile/${User._id}`);
      toast.success("Post Successful!", {
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
    else if (res.status === 409 || res.status === 400)
      toast.error(`Post Failed! ${result.message}`, {
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
    <div
      className={`add-post rounded-lg p-3 ${
        mode === "dark" ? "bg-gray-700" : "bg-white"
      }`}
    >
      <form onSubmit={(e) => handleSubmit(submitForm)(e)}>
        <div className="upper-area mb-3 flex gap-6 items-center">
          <img
            src={`http://localhost:5000/assets/${User.picturePath}`}
            alt="profile"
            className="rounded-full w-12 h-12 cursor-pointer object-cover"
          />
          <input
            type="text"
            className="w-full h-10 p-3 bg-gray-100 text-black rounded-2xl"
            placeholder="What's on your mind?"
            {...register("description", { required: "Desc is required" })}
          />
          {errors.description && (
            <p className="text-red-500 mb-3">{errors.description.message}</p>
          )}
        </div>

        <input
          className={`my-3 mx-auto ${
            showImgInput ? "flex" : "hidden"
          } w-[90%] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
          id="img"
          type="file"
          accept="image/*"
          {...register("file")}
           
        />
        <input
          className={`my-3 mx-auto ${
            showVidInput ? "flex" : "hidden"
          } w-[90%] text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400`}
          id="vid"
          type="file"
          accept="video/*"
          {...register("vid")}
          
        />

        <div className="hr w-[90%] h-0.5 bg-gray-300 mx-auto"></div>

        <div className="post flex justify-between items-center mt-3 mb-2 px-6">
          <label htmlFor="img"
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => {
              setshowImgInput(!showImgInput);
            }}
          >
            <img src="\assets\image.svg" alt="img" className="w-6 h-6" />{" "}
            <span className="text-sm text-gray-500">image</span>
          </label>

          <label htmlFor="vid"
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => {
              setshowVidInput(!showVidInput);
            }}
          >
            <img src="\assets\video.svg" alt="img" className="w-6 h-6" />{" "}
            <span className="text-sm text-gray-500">video</span>
          </label>
          <button
            type="submit"
            className="bg-sky-400 text-white px-4 py-2 rounded-full"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
