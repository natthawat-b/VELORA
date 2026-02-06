import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        productphoto: { type: String, required: true },
        productname: { type: String, required: true},
        productdetail: { type: String, required: true},
        productstyle: { type: String, required: true},
        productsize: { type: String, required: true},
        productAllowedToRent: { type: Boolean, required: true},
        productPrice: { type: Number, required: true},
    }
)

export default mongoose.model("Product", ProductSchema);