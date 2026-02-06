import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
    {
        shopusername: { type: String, requised: true, unique: true},
        shopname: { type: String, requised: true, unique: true},
        shopEmail: { type: String, requised: true, unique: true},
        shopPassword: { type: String, requised: true},
        shopPhone: { type: String, requised: true},
        shopIDcard: { type: String, requised: true, unique: true},
        shopBank: { type: String, requised: true},
        shopBankNumber: { type: String, requised: true},
        
    },
     { timestamps:true, versionKey: false}
    );
    
    export default mongoose.model("Shop", ShopSchema);
