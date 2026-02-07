import { successRes, errRes } from "../../main";
import Product from "../../../model/product";

export default async function getById(id: string) {
    try {
        const product = await Product.findById(id);
        if (!product) {
            return errRes.NOT_FOUND({ message: "Product not found" });
        }
        return successRes(product);
    } catch (error) {
        console.error("Get product by ID error", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: "Internal server error" });
    }
}
