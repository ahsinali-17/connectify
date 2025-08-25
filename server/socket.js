import { Server } from "socket.io";
import { User } from "./models/User.js";
let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins, modify as needed for security
      methods: ["GET", "POST"],
    },
  });
  
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("join", async ({userId}) => {
        try {
             await User.findByIdAndUpdate(userId, { socketId: socket.id });
        }catch (error) {
            console.error("Error updating socket ID:", error);
        }
    })

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log("Socket.io initialized");
};

export const sendMsgToSocketId = (msg, socketId) => {
  if (!io) {
    throw new Error("Socket.io is not initialized. Call initializeSocket first.");
  } else {
     console.log("Sending message to socket ID:", socketId);
    io.to(socketId).emit("message", msg);
  }
}; 