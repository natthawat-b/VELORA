import controller from "@/controller/product/method";
import { IProduct } from "@/types/product";
import { Request, Response } from "express";

async function addproduct(req: Request, res: Response) {
    const data = await controller.addproduct(req.body);
    return res.status(data.code).json(data);
}

export default {
    addproduct,
}