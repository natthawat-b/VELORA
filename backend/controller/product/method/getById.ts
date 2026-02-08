import { successRes, errRes } from "../../main";
import Product from "../../../model/product";
import Shop from "../../../model/shop";

export default async function getById(id: string) {
    try {
        console.log('🔍 getById called with ID:', id);
        
        const product = await Product.findById(id);
        if (!product) {
            console.log('❌ Product not found');
            return errRes.DATA_NOT_FOUND({ message: "Product not found" });
        }

        console.log('✅ Product found:', product.productname);
        console.log('🏪 Product shopId:', product.shopId);

        // Fetch shop data
        let shopData = null;
        if (product.shopId) {
            console.log('🔍 Fetching shop with ID:', product.shopId);
            const shop = await Shop.findById(product.shopId).select('shopname shopPhoto');
            
            if (shop) {
                console.log('✅ Shop found:', shop.shopname);
                console.log('📸 Shop has photo:', !!shop.shopPhoto);
                shopData = {
                    _id: shop._id,
                    name: shop.shopname,
                    photo: shop.shopPhoto
                };
            } else {
                console.log('❌ Shop not found for ID:', product.shopId);
            }
        } else {
            console.log('⚠️ Product has no shopId');
        }

        // Return product with shop data
        const productWithShop = {
            ...product.toObject(),
            shop: shopData
        };

        console.log('📦 Returning product with shop:', shopData ? shopData.name : 'no shop');

        return successRes(productWithShop);
    } catch (error) {
        console.error("❌ Get product by ID error", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: "Internal server error" });
    }
}
