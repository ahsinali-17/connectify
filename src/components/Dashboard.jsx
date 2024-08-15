import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Dashboard = ({ User,postslen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {}, []); 

  const [count, setcount] = useState(0);
  const [message, setmessage] = useState("");
  return (
    <div className="w-full">
      <div
        className="top-info flex gap-6 mb-3"
      >
        <img
          src={`http://localhost:5000/assets/${User.picturePath}`}
          alt="profile"
          className="rounded-full w-16 h-16 object-cover"
        />
        <div className="flex flex-col justify-center">
          <span className="text-lg font-semibold">
            {User.firstName + " " + User.lastName}
          </span>
          <span className="text-center text-sm text-gray-500 cursor-text">
            {User.friends.length} Followers &nbsp; {postslen?`${postslen} posts`:""}
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
