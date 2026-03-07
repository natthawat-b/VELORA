import { successRes, errRes } from "../../main";
import Chat from "../../../model/chat";

// Get or create a chat between user and shop
async function startChat(userId: string, shopId: string) {
    try {
        let chat = await Chat.findOne({ userId, shopId });

        if (!chat) {
            chat = await Chat.create({
                participants: [userId, shopId],
                userId,
                shopId,
                messages: [],
                lastMessage: '',
                lastMessageAt: new Date()
            });
        }

        return successRes(chat);
    } catch (error: any) {
        console.error("Start Chat Error:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

// Send a message
async function sendMessage(chatId: string, sender: string, senderType: string, text: string) {
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return errRes.DATA_NOT_FOUND({ message: "Chat not found" });
        }

        const newMessage = { sender, senderType, text, timestamp: new Date() };
        chat.messages.push(newMessage as any);
        chat.lastMessage = text;
        chat.lastMessageAt = new Date();
        await chat.save();

        return successRes(chat);
    } catch (error: any) {
        console.error("Send Message Error:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

// Get messages for a chat
async function getMessages(chatId: string) {
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return errRes.DATA_NOT_FOUND({ message: "Chat not found" });
        }
        return successRes(chat);
    } catch (error: any) {
        console.error("Get Messages Error:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

// Get chat list for a participant (user or shop)
async function getChatList(participantId: string) {
    try {
        const chats = await Chat.find({
            participants: participantId
        }).sort({ lastMessageAt: -1 }).lean();

        return successRes(chats);
    } catch (error: any) {
        console.error("Get Chat List Error:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

export default {
    startChat,
    sendMessage,
    getMessages,
    getChatList,
};
