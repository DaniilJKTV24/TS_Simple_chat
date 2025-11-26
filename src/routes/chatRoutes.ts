import { Router } from "express";
import { chatController } from "../controllers/chatController";

// Router for chat-related REST endpoints
const router = Router();

// Return the chat message history
router.get("/api/messages", chatController.getMessages);

export default router;
