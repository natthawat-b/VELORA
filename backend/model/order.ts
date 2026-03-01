import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productPhoto: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  type: { type: String, enum: ["buy", "rent"], default: "buy" },
  rentalDays: { type: Number, default: 0 },
  shopName: { type: String },
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  details: { type: String, required: true },
  province: { type: String },
  district: { type: String },
  subDistrict: { type: String },
  postalCode: { type: String },
}, { _id: false });

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: { type: AddressSchema, required: true },
    shippingMethod: { type: String, enum: ["standard", "fast"], default: "standard" },
    shippingCost: { type: Number, default: 0 },
    insuranceCost: { type: Number, default: 0 },
    paymentMethod: { type: String, default: "promptpay" },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["picked_up", "shipping", "completed"], default: "picked_up" },
    trackingNumber: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Order", OrderSchema);
