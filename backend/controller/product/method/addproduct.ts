import { successRes, errRes } from "../../main";
import Product from "../../../model/product";
import { IProduct } from "../../../types/product";

export default async function addproduct(data: IProduct) {
    try {
        const newProduct = await Product.create(data);
        return successRes(newProduct);
    } catch (error: any) {
        console.log(error)
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
