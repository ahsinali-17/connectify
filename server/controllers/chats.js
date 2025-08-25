import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
import { sendMsgToSocketId } from "../socket.js";
import { User } from "../models/User.js";


export const saveChat = async (req, res) => {
    const {message, senderId, recieverId} = req.body;
    if (!message || !senderId || !recieverId) {
        return res.status(400).json({error: "All fields are required"});
    }
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
          chat = new Chat({
            participants: [senderId, recieverId].sort(),
            lastMessage: {
                senderId,
                text: message,
            }
        });
        await chat.save();
    }

    const msg = await Message.create({
        chatId: chat._id,
        senderId,
        text: message,
    });

    const reciever = await User.findById(recieverId);
    const sender = await User.findById(senderId);

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
        return res.status(201).json({message: "Chat not found"});
    }

    const messages = await Message.find({chatId: chat._id})
        .populate("senderId", "_id picturePath")
        .sort({timestamp: 1}).limit(20);
    return res.status(200).json({messages});
}