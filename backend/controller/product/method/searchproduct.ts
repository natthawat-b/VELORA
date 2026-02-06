import { successRes, errRes } from "../../main";
import Product from "../../../model/product";
import { IProduct } from "../../../types/product";

export default async function searchproduct(data: IProduct) {
    try {
        const searchProduct = await Product.find({productname: data.productname});
        return successRes(searchProduct);
    } catch (error: any) {
        console.log(error)
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}   