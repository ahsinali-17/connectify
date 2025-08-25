import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Chat from "./Chat";
import FriendList from "./FriendList";
import { useSelector, useDispatch } from "react-redux";
import { setFriends } from "../state/index";

const FriendSection = () => {
  const dispatch = useDispatch();
  const User = useSelector((state) => state.auth.user);
  const friends = useSelector((state) => state.auth.friends);
  const token = useSelector((state) => state.auth.token);

  const chatRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPerson, setChatPerson] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const getMessages = async (friend) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/get-chat?user1Id=${User?._id}&user2Id=${friend?._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      }
    });
    const data = await response.json();
    if(response.status == 201) {
      return;
    }
    setMessages(data.messages);
    setLoadingMessages(false);
  }

  const handleMessageClick = async (friend) => {
    setChatOpen(true);
    setChatPerson(friend);
    await getMessages(friend)
    gsap.to(chatRef.current, {
      height: "80%",
      duration: 0.6,
      ease: "power2.out",
    });
  };

  // Reset chat height if needed (optional)
  const handleCloseChat = () => {
    setChatOpen(false);
    gsap.to(chatRef.current, {
      height: "7%",
      duration: 0.6,
      ease: "power2.in",
    });
  };

  const unfriend = async (friendId) => {
    let res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/${User._id}/${friendId}`,
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

  const getFriends = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/${User._id}/friends`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );
    const data = await res.json();
    if (res.status === 200) dispatch(setFriends({ friends: data }));
  };
  if (User && User.friends.length && friends[0]?._id !== User?.friends[0]) getFriends();

  return (
    <div className="flex flex-col justify-between gap-3 py-3 items-center w-full h-full relative">
      <div className="h-[80%] overflow-y-auto relative z-20 w-full">
        <FriendList onMessageClick={handleMessageClick} friends={friends} unfriend={unfriend} />
      </div>
      <div
        ref={chatRef}
        className={`${
          chatOpen ? "overflow-y-auto" : "overflow-hidden"
        } absolute bottom-0 z-50 w-full h-[7%] rounded-t-2xl border-2 border-sky-500 rounded-lg bg-white`}
      >
        <Chat
          onDownClick={handleCloseChat}
          onUpClick={handleMessageClick}
          chatOpen={chatOpen}
          chatPerson={chatPerson || friends[0]}
          messages={messages}
          setMessages={setMessages}
          user={User}
          getMessages={getMessages}
          loading={loadingMessages}
          token={token}
        />
      </div>
    </div>
  );
};

export default FriendSection;
