import { successRes, errRes } from "../../main";
import Product from "../../../model/product";
import { IProduct } from "../../../types/product";

export default async function editproduct(id: string, data: IProduct) {
    try {
        const editProduct = await Product.updateOne({ _id: id }, data);
        return successRes(editProduct);
    } catch (error: any) {
        console.log(error)
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}   