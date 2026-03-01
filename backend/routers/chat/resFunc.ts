import controller from "@/controller/chat/method";
import { Request, Response } from "express";

async function startChat(req: Request, res: Response) {
    const { userId, shopId } = req.body;
    if (!userId || !shopId) {
        return res.status(400).json({ success: false, error: { message: "userId and shopId are required" } });
    }
    const data = await controller.startChat(userId, shopId);
    return res.status(data.code).json(data);
}

async function sendMessage(req: Request, res: Response) {
    const { chatId, sender, senderType, text } = req.body;
    if (!chatId || !sender || !senderType || !text) {
        return res.status(400).json({ success: false, error: { message: "chatId, sender, senderType, and text are required" } });
    }
    const data = await controller.sendMessage(chatId, sender, senderType, text);
    return res.status(data.code).json(data);
}

async function getMessages(req: Request, res: Response) {
    const data = await controller.getMessages(req.params.chatId as string);
    return res.status(data.code).json(data);
}

async function getChatList(req: Request, res: Response) {
    const data = await controller.getChatList(req.params.participantId as string);
    return res.status(data.code).json(data);
}

export default {
    startChat,
    sendMessage,
    getMessages,
    getChatList,
};
