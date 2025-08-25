import React from "react";
import { Link } from "react-router-dom";

const FriendList = ({ onMessageClick, friends, unfriend }) => {
  return (
    <div className="w-full flex flex-col gap-3 px-3">
      <h1 className="text-2xl text-left font-semibold underline underline-offset-2 decoration-sky-400">
        Friends
      </h1>
      {friends.map((friend, index) => {
        return (
          <div className="flex justify-between items-center" key={index}>
            <Link
              to={`/profile/${friend._id}`}
              key={index}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/assets/${friend.picturePath}`}
                alt="dp"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold hover:underline">
                  {friend.firstName + " " + friend.lastName}
                </span>
                <span className="text-sm text-gray-500 cursor-text">
                  {friend.location}
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <img
                src="/assets/message.svg"
                alt="chat"
                className="w-4 h-4 cursor-pointer"
                onClick={() => onMessageClick(friend)}
              />
            
            <img
              src={`${
                friends.filter((fri) => fri._id === friend._id).length !==
                0
                  ? "/assets/friend_added.svg"
                  : "/assets/friend.svg"
              }`}
              alt="add me"
              className="w-4 h-4 cursor-pointer"
              onClick={() => unfriend(friend._id)}
            />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FriendList;
