import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
        productphoto: { type: String, required: true },
        productname: { type: String, required: true},
        productdetail: { type: String, required: true},
        productstyle: { type: String, required: true},
        productsize: { type: String, required: true},
        productprice: { type: Number, required: true},
        productrentprice: { type: Number, required: false},
        productAllowedToRent: { type: Boolean, required: true},
    },
    { timestamps: true, versionKey: false }
)

export default mongoose.model("Product", ProductSchema);