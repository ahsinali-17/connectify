import React, { useState} from "react";
import { setFriends} from "../state/index";
import { useSelector, useDispatch } from "react-redux";

const Dashboard = ({ User, postslen }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const [count, setcount] = useState(0);
  const [message, setmessage] = useState("");

  const addRemoveFriend = async () => {
      let res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${currentUser._id}/${User._id}`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                      },
                    }
                  );
                  let data = await res.json();
                  if(res.status===200) dispatch(setFriends({ friends: data }));
    }

  return (
    <div className="w-full">
      <div className="top-info flex gap-6 mb-3 w-full">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/assets/${
            User.picturePath
          }`}
          alt="profile"
          className="rounded-full w-16 h-16 object-cover flex-shrink-0"
        />
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-lg font-semibold flex items-center justify-between pr-3">
            {User.firstName + " " + User.lastName}

            <img
              src={
                currentUser?.friends.includes(User._id)
                  ? "/assets/friend_added.svg"
                  : "/assets/friend.svg"
              }
              alt="friend icon"
              className={`${currentUser._id===User._id && "hidden"} w-4 h-4 cursor-pointer`}
              onClick={addRemoveFriend}
            />
          </span>
          <span className="text-left text-sm text-gray-500 cursor-text">
            {User.friends.length} Following &nbsp;{" "}
            {postslen ? `${postslen} posts` : ""}
          </span>
        </div>
      </div>
      <div className="hr w-[80%] h-0.5 bg-gray-300 mx-auto"></div>

      <div className="mid-info mt-4 space-y-3 mb-3">
        <div className="flex gap-6">
          <img src="\assets\location.svg" alt="loc" className="w-6 h-6" />
          <span className="text-gray-500">{User.location}</span>
        </div>
        <div className="flex gap-6">
          <img src="\assets\occupation.svg" alt="occ" className="w-6 h-6" />
          <span className="text-gray-500">{User.occupation}</span>
        </div>
      </div>
      <div className="hr w-[80%] h-0.5 bg-gray-300 mx-auto"></div>

      <div className="views mt-4 space-y-3 mb-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Profile Views</span>
          <span className="text-sky-400">{User.impressions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Profile Impressions</span>
          <span className="text-sky-400"> 1067</span>
        </div>
      </div>
      <div className="hr w-[80%] h-0.5 bg-gray-300 mx-auto"></div>
      <div className="social">
        <span className="text-gray-500">Social Profiles</span>
        <div className="flex flex-col gap-3 mt-4 mb-3">
          <div className="space flex justify-between">
            <div className="github flex gap-3 items-center">
              <img
                src="\assets\github.svg"
                alt="github"
                className="w-6 h-6 cursor-pointer"
              />
              <div className="flex flex-col">
                <a
                  href="https://github.com/ahsinali-17"
                  className="text-sky-400 font-semibold text-md cursor-pointer decoration-none"
                  target="_"
                  onClick={() => {
                    setmessage("");
                    setcount(0);
                  }}
                >
                  Github
                </a>
                <span className="text-gray-500 text-sm">Public Profile</span>
              </div>
            </div>
            <img
              src={
                count === 3 ? "\\assets\\editgray.svg" : "\\assets\\edit.svg"
              }
              alt="github"
              className="w-6 h-6 cursor-pointer"
              onClick={() => {
                if (count === 0) {
                  setcount(1);
                  setmessage("Don't change it. Go visit my profiles🥺");
                } else if (count === 1) {
                  setcount(2);
                  setmessage("I said Don't!!!😠");
                } else if (count === 2) {
                  setcount(3);
                  setmessage(
                    "You can't change them. Just visit my profiles😡👊"
                  );
                }
              }}
            />
          </div>

          <div className="space flex justify-between">
            <div className="github flex gap-3 items-center">
              <img
                src="\assets\linkedin.svg"
                alt="github"
                className="w-6 h-6 cursor-pointer"
              />
              <div className="flex flex-col">
                <a
                  href="https://www.linkedin.com/in/ahsin-ali-3a5135276/"
                  className="text-sky-400 font-semibold text-md cursor-pointer"
                  target="_"
                  onClick={() => {
                    setmessage("");
                    setcount(0);
                  }}
                >
                  Linkedin
                </a>
                <span className="text-gray-500 text-sm">Network Platform</span>
              </div>
            </div>
            <img
              src={
                count === 3 ? "\\assets\\editgray.svg" : "\\assets\\edit.svg"
              }
              alt="github"
              className="w-6 h-6 cursor-pointer"
              onClick={() => {
                if (count === 0) {
                  setcount(1);
                  setmessage("Don't change it. Go visit my profiles🥺");
                } else if (count === 1) {
                  setcount(2);
                  setmessage("I said Don't!!!😠");
                } else if (count === 2) {
                  setcount(3);
                  setmessage(
                    "You can't change them. Just visit my profiles😡👊"
                  );
                }
              }}
            />
          </div>
          <div>
            <p className="text-red-500 font-semibold">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
