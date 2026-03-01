import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
    {
        shopusername: { type: String, requised: true, unique: true},
        shopname: { type: String, requised: true, unique: true},
        shopEmail: { type: String, requised: true, unique: true},
        shopPassword: { type: String, requised: true},
        shopPhone: { type: String, requised: true},
        shopIDcard: { type: String, unique: true, sparse: true },
        shopBank: { type: String },
        shopBankNumber: { type: String },
        shopPhoto: { type: String }, // Profile photo (base64)
        followers: [{ type: String }], // Array of user IDs who follow this shop
        lastActive: { type: Date, default: null }, // Last time shop owner was active
    },
     { timestamps:true, versionKey: false}
    );
    
    export default mongoose.model("Shop", ShopSchema);
