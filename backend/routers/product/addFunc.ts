import controller from "@/controller/product/method";
import { IProduct } from "@/types/product";
import { Request, Response } from "express";

async function addproduct(req: Request, res: Response) {
    const data = await controller.addproduct(req.body);
    return res.status(data.code).json(data);
}

async function getAllProducts(req: Request, res: Response) {
    const data = await controller.getAllProducts();
    return res.status(data.code).json(data);
}

async function getProductsByShop(req: Request, res: Response) {
    const shopId = req.params.shopId as string;
    const data = await controller.getProductsByShop(shopId);
    return res.status(data.code).json(data);
}

async function getProductById(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = await controller.getProductById(id);
    return res.status(data.code).json(data);
}

export default {
    addproduct,
    getAllProducts,
    getProductsByShop,
    getProductById,
}