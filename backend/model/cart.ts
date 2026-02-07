import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, min: 1 },
                size: { type: String, required: false }, // Optional size
                rentalDays: { type: Number, required: false }, // Optional rental days
                // You might want to store price snapshot here if prices change often, 
                // but for now let's rely on looking up the product.
            }
        ]
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Cart", CartSchema);
