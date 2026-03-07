import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['income', 'withdraw'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    orderId: { type: String },
    status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
    createdAt: { type: Date, default: Date.now }
}, { _id: true });

const WalletSchema = new mongoose.Schema({
    shopId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    transactions: [TransactionSchema]
}, { timestamps: true, versionKey: false });

export default mongoose.model("Wallet", WalletSchema);
