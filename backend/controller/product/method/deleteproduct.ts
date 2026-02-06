import { successRes, errRes } from "../../main";
import Product from "../../../model/product";
    
export default async function deleteproduct(id: string) {
    try {
        const deleteProduct = await Product.deleteOne({ _id: id });
        return successRes(deleteProduct);
    } catch (error: any) {
        console.log(error)
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}