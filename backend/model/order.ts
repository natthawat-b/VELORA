import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productPhoto: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    type: { type: String, enum: ['buy', 'rent'], default: 'buy' },
    rentalDays: { type: Number },
    shopId: { type: String },
    shopName: { type: String }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    userId: { type: String, required: true },
    items: [OrderItemSchema],
    shippingAddress: {
        name: String,
        phone: String,
        details: String,
        province: String,
        district: String,
        subDistrict: String,
        postalCode: String
    },
    shippingMethod: { type: String, default: 'standard' },
    paymentMethod: { type: String, default: 'promptpay' },
    productTotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    insuranceCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'paid', 'shipping', 'completed', 'cancelled'],
        default: 'paid'
    }
}, { timestamps: true, versionKey: false });

export default mongoose.model("Order", OrderSchema);
