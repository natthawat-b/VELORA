import controller from "../../controller/cart/method";
import { Request, Response } from "express";

async function addToCart(req: Request, res: Response) {
    const data = await controller.addToCart(req.body);
    return res.status(data.code).json(data);
}

async function getCart(req: Request, res: Response) {
    const userId = req.params.userId as string;
    const data = await controller.getCart(userId);
    return res.status(data.code).json(data);
}

async function updateCartItem(req: Request, res: Response) {
    const data = await controller.updateCartItem(req.body);
    return res.status(data.code).json(data);
}

async function removeFromCart(req: Request, res: Response) {
    const data = await controller.removeFromCart(req.body);
    return res.status(data.code).json(data);
}

export default {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
}
