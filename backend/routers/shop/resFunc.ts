import controller from "@/controller/shop/method";
import { Request, Response } from "express";
import { IShop } from "@/types/shop";

interface IdParams {
    id: string;
}

async function register(req: Request, res: Response) {
    const data = await controller.registerShop(req.body);
    return res.status(data.code).json(data);
}

async function login(req: Request, res: Response) {
    return controller.loginShop(req, res);
}

async function getShopById(req: Request<IdParams>, res: Response) {
    const data = await controller.getById(req.params.id);
    return res.status(data.code).json(data);
}

export default {
    register,
    login,
    getShopById,
};
