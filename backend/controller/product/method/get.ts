import { Request, Response } from "express";
import { successRes, errRes } from "../../main";
import Product from "../../../model/product";

export default async function get(req: Request, res: Response) {
    try {
        const products = await Product.find({});
        return successRes(products);
    } catch (error) {
        console.error("Get product error", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: "Internal server error" });
    }
}
