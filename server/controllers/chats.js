import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
import { sendMsgToSocketId, broadcastFriendUpdate } from "../socket.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";


export const saveChat = async (req, res) => {
    const {message, senderId, recieverId} = req.body;
    if (!message || !senderId || !recieverId) {
        return res.status(400).json({error: "All fields are required"});
    }
    
    const sender = await User.findById(senderId);
    const reciever = await User.findById(recieverId);

    // Check if users are friends
    const areFriends = sender.friends.includes(recieverId) && reciever.friends.includes(senderId);
   
    let chat = await Chat.findOne({
       participants:[senderId, recieverId].sort()
    });
    if(chat){
        let chatId = chat._id;
         await Chat.findByIdAndUpdate(chatId, {
            lastMessage: {
                senderId,
                text: message,
            }
        }, { new: true });
    } else{
          const pendingExpires = areFriends ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
          
          chat = new Chat({
            participants: [senderId, recieverId].sort(),
            lastMessage: {
                senderId,
                text: message,
            },
            requestStatus: areFriends ? "accepted" : "pending",
            requestSenderId: areFriends ? null : senderId,
            pendingExpiresAt: pendingExpires,
        });
        await chat.save();
    }

    const msg = await Message.create({
        chatId: chat._id,
        senderId,
        text: message,
    });

     // Format message as in getChats 
        const formattedMsg = {
            _id: msg._id,
            chatId: msg.chatId,
            senderId: {
                _id: sender._id,
                picturePath: sender.picturePath,
            },
            text: msg.text,
            timestamp: msg.timestamp,
        };

        sendMsgToSocketId(formattedMsg, reciever.socketId);

        return res.status(201).json({ data: formattedMsg, message: "Chat saved successfully" });
}

export const getChats = async (req, res) => {
    const {user1Id, user2Id} = req.query;
    if(!user1Id || !user2Id) {
        return res.status(400).json({error: "Both user IDs are required"});
    }
    let chat = await Chat.findOne({participants: [user1Id, user2Id].sort()});

    if(!chat) {
        return res.status(404).json({message: "Chat not found"});
    }

    const messages = await Message.find({chatId: chat._id})
        .populate("senderId", "_id picturePath")
        .sort({timestamp: 1}).limit(20);
    return res.status(200).json({messages, requestStatus: chat.requestStatus});
}

export const getMessageRequests = async (req, res) => {
    try {
        const {userId} = req.params;
        if(!userId) {
            return res.status(400).json({error: "User ID is required"});
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const user = await User.findById(userId);
        
        // Get all chats where this user is a participant and requestStatus is "pending"
        const pendingChats = await Chat.find({
            participants: { $in: [userObjectId] },
            requestStatus: "pending",
            requestSenderId: { $ne: userObjectId }  
        }).populate("requestSenderId", "_id firstName lastName picturePath location");

        if(!pendingChats || pendingChats.length === 0) {
            return res.status(200).json({requests: []});
        }

        // Format the response 
        const requests = await Promise.all(
            pendingChats.map(async (chat) => {
                const latestMessage = await Message.findOne({chatId: chat._id})
                    .sort({timestamp: -1})
                    .populate("senderId", "_id firstName lastName picturePath");
                
                return {
                    chatId: chat._id,
                    sender: chat.requestSenderId,
                    lastMessage: latestMessage?.text,
                    lastMessageTime: latestMessage?.timestamp,
                    messageCount: await Message.countDocuments({chatId: chat._id}),
                };
            })
        );
        return res.status(200).json({requests});
    } catch (error) {
        console.error("Error in getMessageRequests:", error);
        return res.status(500).json({error: error.message});
    }
}

export const acceptMessageRequest = async (req, res) => {
    try {
        const {chatId, userId} = req.body;
        if(!chatId || !userId) {
            return res.status(400).json({error: "Chat ID and User ID are required"});
        }

        const chat = await Chat.findById(chatId).populate("requestSenderId participants");
        if(!chat) {
            return res.status(404).json({error: "Chat not found"});
        }

        // Update chat status to accepted and clear expiration
        chat.requestStatus = "accepted";
        chat.requestSenderId = null;
        chat.pendingExpiresAt = null;
        await chat.save();

        // Add users to each other's friends list
        const [userId1, userId2] = chat.participants.map(p => p._id.toString());
        const otherUserId = userId1 === userId ? userId2 : userId1;

        const user = await User.findById(userId);
        const otherUser = await User.findById(otherUserId);

        if(!user.friends.includes(otherUserId)) {
            user.friends.push(otherUserId);
            await user.save();
        }
        if(!otherUser.friends.includes(userId)) {
            otherUser.friends.push(userId);
            await otherUser.save();
        }
        
        // Broadcast friend updates to both users
        broadcastFriendUpdate(userId);
        broadcastFriendUpdate(otherUserId);

        return res.status(200).json({message: "Message request accepted", chat, newFriend: otherUser});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}