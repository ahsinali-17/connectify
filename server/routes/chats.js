import express from "express"
import { verifytoken } from "../middleware/auth.js";
import { getChats, saveChat, getMessageRequests, acceptMessageRequest } from "../controllers/chats.js";

const router = express.Router();

router.post(`/save-chat`, verifytoken, saveChat);

router.get(`/get-chat`, verifytoken, getChats);

router.get(`/message-requests/:userId`, verifytoken, getMessageRequests);

router.post(`/accept-request`, verifytoken, acceptMessageRequest);

export default router;
