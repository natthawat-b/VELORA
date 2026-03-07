import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    senderType: { type: String, enum: ['user', 'shop'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { _id: true });

const ChatSchema = new mongoose.Schema({
    participants: [{ type: String, required: true }], // [userId, shopId]
    userId: { type: String, required: true },
    shopId: { type: String, required: true },
    messages: [MessageSchema],
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: false });

// Index for fast lookup
ChatSchema.index({ userId: 1, shopId: 1 }, { unique: true });

export default mongoose.model("Chat", ChatSchema);
