import express from "express"
import { verifytoken } from "../middleware/auth.js";
import { getChats, saveChat } from "../controllers/chats.js";

const router = express.Router();

router.post(`/save-chat`, verifytoken, saveChat);

router.get(`/get-chat`, verifytoken, getChats);

export default router;
