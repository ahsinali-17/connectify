import React, { useState, useEffect } from "react";
import Feed from "./Feed";
import Dashboard from "./Dashboard";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "../state/index";
import { useParams } from "react-router-dom";
import Loader from "./Loader";

const Profile = () => {
  const mode = useSelector((state) => state.auth.mode);
  const token = useSelector((state) => state.auth.token);
  const posts = useSelector((state) => state.auth.posts);
  const User = useSelector((state) => state.auth.user); 
  const { userId } = useParams();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    firstName: "Ahsin",
    lastName: "Ali",
    location: "Karachi",
    occupation: "Full Stack Developer",
    friends: [1, 2, 3],
    picturePath: "default.jpg",
    impressions: 1000,
  });

  const [navigation, setnavigation] = useState("feed");

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await res.json();
      setUser(data);
    };
    getUser();

    const getUserPosts = async () => {
      const res = await fetch(`http://localhost:5000/posts/${userId}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await res.json();
      dispatch(setPosts({ posts: data }));
    };
    getUserPosts();
  }, [userId]);

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

      <div className="flex lg:hidden rounded-full bg-gray-300 p-0 m-0 mb-2">
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
          } p-2 rounded-r-full`}
        >
          Posts
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
        <Dashboard User={user} posts={posts ? posts : dummyPost}/>
      </div>

      <div
        className={`lg:w-[50%] w-full rounded-lg ${
          navigation === "feed" ? "flex" : "hidden"
        } lg:flex flex-col max-h-[90vh] overflow-y-scroll ${
          mode === "dark" ? "bg-gray-800" : "bg-gray-200"
        } p-2 lg:pb-6 pb-20 shadoww`}
      >
        <Feed posts={posts } />
      </div>
      </div>
    </div>
  );
};

export default Profile;
