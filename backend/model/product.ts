import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        productid: { type: String, unique: true },
        shopId: { type: String, required: true }, // ID ของร้านค้าที่เป็นเจ้าของสินค้า
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