import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFriends } from "../state/index";

const MessageRequests = ({ onMessageClick, token }) => {
  const user = useSelector((state) => state.auth.user);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const friends = useSelector((state) => state.auth.friends);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      fetchMessageRequests();
    }
  }, [user?._id, token]);

  const fetchMessageRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chat/message-requests/${user._id}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching message requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (chatId, sender) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chat/accept-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            chatId,
            userId: user._id,
          }),
        }
      );
      const response = await res.json();
      if (res.status === 200) {
        // Remove from requests
        setRequests(requests.filter((req) => req.chatId !== chatId));
        
        // Update friends list from response
        if (response.friends) {
          dispatch(setFriends({ friends: [...friends, response.newFriend] }));
        }
        
        // Navigate to the chat
        onMessageClick(sender);
      } else {
        console.error("Failed to accept request:", response.message || response.error);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-sky-500 font-semibold py-4">
        Loading...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center text-gray-500 font-semibold py-4">
        No message requests
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 px-3">
      <h1 className="text-2xl text-left font-semibold underline underline-offset-2 decoration-sky-400">
        Message Requests ({requests.length})
      </h1>
      {requests.map((request, index) => {
        return (
          <div
            className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            key={index}
          >
            <div className="flex items-center gap-2 flex-1">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/assets/${
                  request.sender?.picturePath
                }`}
                alt="dp"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold">
                  {request.sender?.firstName} {request.sender?.lastName}
                </span>
                <span className="text-xs text-gray-500">
                  {request.sender?.location}
                </span>
                <p className="text-xs text-gray-600 truncate mt-1">
                  {request.lastMessage}
                </p>
                <span className="text-xs text-gray-400">
                  {request.messageCount} message
                  {request.messageCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() =>
                  handleAcceptRequest(request.chatId, request.sender)
                }
                className="bg-sky-500 text-white px-4 py-2 rounded text-sm hover:bg-sky-600 transition font-semibold"
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageRequests;
