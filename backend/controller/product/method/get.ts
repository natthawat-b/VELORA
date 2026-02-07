import { Request, Response } from "express";
import { successRes, errRes } from "../../main";
import Product from "../../../model/product";

export default async function get(req: Request, res: Response) {
    try {
        const products = await Product.find({});
        return res.status(200).json(successRes(products));
    } catch (error) {
        console.error("Get product error", error);
        return res.status(500).json(errRes.INTERNAL_SERVER_ERROR({ message: "Internal server error" }));
    }
}
