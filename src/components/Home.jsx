import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "../state/index";
import Feed from "./Feed";
import AddPost from "./AddPost";
import FriendList from "./FriendList";
import Dashboard from "./Dashboard";
import Loader from "./Loader";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const User = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.auth.posts);
  const mode = useSelector((state) => state.auth.mode);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const res = await fetch(`http://localhost:5000/posts/getposts/${User._id}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });
    const data = await res.json();
    if (res.status === 200)
    dispatch(setPosts({ posts: data }));
  };

  const [navigation, setnavigation] = useState("feed");

  if(User === null || posts.length == 0) 
    return <div className={`mt-[8vh] h-[92vh] ${
      mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
    } px-4 pt-4`}><Loader/></div>;

  return (
    <div
      className={`mt-[8vh] h-[92vh] ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      } px-4 pt-4`}
    >
  
      <div className="flex lg:hidden rounded-full bg-gray-300 p-0 m-0 my-2 shadoww">
        <button
          onClick={() => {
            setnavigation("dashboard");
          }}
          className={`w-full h-full ${
            navigation === "dashboard"
              ? "bg-sky-400 font-semibold text-white"
              : ""
          } p-2 rounded-l-full`}
        >
          Dashboard
        </button>
        <button
          onClick={() => {
            setnavigation("feed");
          }}
          className={`w-full h-full ${
            navigation === "feed" ? "bg-sky-400 font-semibold text-white" : ""
          } p-2 rounded`}
        >
          Feed
        </button>
        <button
          onClick={() => {
            setnavigation("friends");
          }}
          className={`w-full h-full ${
            navigation === "friends"
              ? "bg-sky-400 font-semibold text-white"
              : ""
          } p-2 rounded-r-full`}
        >
          Friends
        </button>
      </div>

      <div className="flex gap-2">
        <div
          className={`lg:w-[25%] lg:flex ${
            navigation === "dashboard" ? "flex" : "hidden"
          } w-full rounded-lg p-3 ${
            mode === "dark" ? "bg-gray-700" : "bg-white"
          } max-h-[72vh] overflow-y-auto shadoww`}
        >
          <Dashboard User={User} />
        </div>

        <div
          className={`lg:w-[50%] w-full rounded-lg ${
            navigation === "feed" ? "flex" : "hidden"
          } lg:flex flex-col max-h-[90vh] overflow-y-scroll ${
            mode === "dark" ? "bg-gray-800" : "bg-gray-200"
          } p-2 lg:pb-6 pb-20 shadoww`}
        >
          <AddPost />

          <Feed posts={posts} />
        </div>
        <div
          className={`lg:w-[25%] lg:flex ${
            navigation === "friends" ? "flex" : "hidden"
          } w-full rounded-lg p-3 ${
            mode === "dark" ? "bg-gray-700" : "bg-white"
          }  max-h-[55vh] overflow-y-auto shadoww`}
        >
          <FriendList />
        </div>
      </div>
    </div>
  );
};

export default Home;
