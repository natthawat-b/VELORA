import { successRes, errRes } from "../../main";
import Product from "../../../model/product";

// ดึงสินค้าทั้งหมด
export async function getAllProducts() {
    try {
        const products = await Product.find().populate('shopId', 'shopname');
        return successRes(products);
    } catch (error: any) {
        console.log(error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

// ดึงสินค้าตาม shopId
export async function getProductsByShop(shopId: string) {
    try {
        const products = await Product.find({ shopId });
        return successRes(products);
    } catch (error: any) {
        console.log(error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

// ดึงสินค้าตาม id
export async function getProductById(productId: string) {
    try {
        const product = await Product.findById(productId).populate('shopId', '_id shopname');
        if (!product) {
            return errRes.DATA_NOT_FOUND({ message: "Product not found" });
        }
        return successRes(product);
    } catch (error: any) {
        console.log(error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
