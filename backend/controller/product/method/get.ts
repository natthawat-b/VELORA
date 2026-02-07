import { Request, Response } from "express";
import { successRes, errRes } from "../../main";
import Product from "../../../model/product";

export default async function get(req: Request, res: Response) {
    try {
        // Create filter object from query params
        const filter: any = {};
        
        // Filter by shopId if provided
        if (req.query.shopId) {
            filter.shopId = req.query.shopId;
        }

        const products = await Product.find(filter);
        return successRes(products);
    } catch (error) {
        console.error("Get product error", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: "Internal server error" });
    }
}
