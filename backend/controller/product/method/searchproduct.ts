import { successRes, errRes } from "../../main";
import Product from "../../../model/product";
import { IProduct } from "../../../types/product";

export default async function searchproduct(data: IProduct) {
    try {
        console.log("Search request received:", data);
        const searchProduct = await Product.find({ 
            productname: { $regex: data.productname, $options: 'i' } 
        });
        console.log("Search results:", searchProduct);
        return successRes(searchProduct);
    } catch (error: any) {
        console.log("Search error:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}   