import React, { useState, useRef, useEffect, useContext } from "react";
import { SocketContext } from "../SocketContext";

const Chat = ({
  onDownClick,
  chatOpen,
  onUpClick,
  chatPerson,
  user,
  messages,
  setMessages,
  loading,
  token,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      };
    socket.on("message", handler);
    return () => {
      socket.off("message", handler);
    };
    // eslint-disable-next-line
  }, [socket, chatPerson, user, messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/chat/save-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          message: input,
          senderId: user._id,
          recieverId: chatPerson._id,
        }),
      }
    );
    const data = await response.json();
    setMessages((prevMessages) => [...prevMessages, data.data]);
    setInput("");
  };

  if (loading) {
    return (
      <div className="text-center text-sky-500 font-semibold">Loading...</div>
    );
  }

  return (
    <div className="px-2 w-full h-full">
      <div className="flex justify-between items-center gap-2 border-b-2 border-sky-500 px-2 w-full">
        <p className="p-2 font-semibold">
          {chatOpen ? chatPerson?.firstName : "Chat"}
        </p>
        <img
          src={!chatOpen ? "/assets/up.svg" : "/assets/down.svg"}
          alt="up/down"
          className="w-6 h-6 cursor-pointer"
          onClick={() => (chatOpen ? onDownClick() : onUpClick(chatPerson))}
        />
      </div>

      <div className="flex flex-col justify-between h-[90%] w-full overflow-hidden">
        <div className="w-full flex-1 flex flex-col overflow-y-auto p-2 space-y-2">
          {messages.length === 0 && !loading ? (
            <div className="text-center text-sky-500 font-semibold">
              No chats found...
            </div>
          ) : (
            messages?.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 w-[75%] ${
                  msg?.senderId._id === user._id
                    ? "self-end text-right flex-row-reverse"
                    : "self-start text-left"
                }`}
              >
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/assets/${
                    msg?.senderId?.picturePath
                  }`}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <p
                  className={`w-[70%] px-3 py-2 rounded-lg text-white text-base break-words flex flex-col ${
                    msg?.senderId._id === user._id
                      ? "bg-sky-500"
                      : "bg-gray-400"
                  }
            `}
                >
                  <span className="text-left">{msg?.text}</span>
                  <span className="text-nowrap text-right text-xs">
                    {new Date(msg?.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} className={`${chatOpen ? "" : "hidden"}`} />
        </div>
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 p-2 border-t w-full"
        >
          <input
            type="text"
            className="border rounded px-2 py-1 outline-none w-[85%]"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-sky-500 text-white px-2 py-1 rounded flex-shrink-0 flex items-center justify-center"
          >
            <img src="/assets/send.svg" alt="send" className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
