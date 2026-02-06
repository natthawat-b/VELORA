import controller from "@/controller/shop/method";
import { Request, Response } from "express";
import { IShop } from "@/types/shop";

async function register(req: Request, res: Response) {
    const data = await controller.registerShop(req.body);
    return res.status(data.code).json(data);
}

async function login(req: Request, res: Response) {
    return controller.loginShop(req, res);
}

export default {
    register,
    login,
};
