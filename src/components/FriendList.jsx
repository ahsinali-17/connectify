import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFriends } from "../state/index";
import { Link } from "react-router-dom";

const FriendList = () => {
  const dispatch = useDispatch();
  const User = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const getFriends = async () => {
      const res = await fetch(
        `http://localhost:5000/users/${User._id}/friends`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await res.json();
      dispatch(setFriends({ friends: data }));
    };
    getFriends();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 px-4">
      <h1 className="text-2xl text-center font-semibold underline underline-offset-2 decoration-sky-400 mb-4">
        Friends
      </h1>
      {User.friends.map((friend, index) => {
        return (
          <div className="flex justify-between items-center" key={index}>
            <Link
              to={`/profile/${friend._id}`}
              key={index}
              className="flex items-center gap-4 cursor-pointer"
            >
              <img
                src={`http://localhost:5000/assets/${friend.picturePath}`}
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
            <img
              src={`${
                User.friends.filter((fri) => fri._id === friend._id).length !==
                0
                  ? "/assets/friend_added.svg"
                  : "/assets/friend.svg"
              }`}
              alt="add me"
              className="w-4 h-4 cursor-pointer"
              onClick={async () => {
                let res = await fetch(
                  `http://localhost:5000/users/${User._id}/${friend._id}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                let data = await res.json();
                dispatch(setFriends({ friends: data }));
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FriendList;
