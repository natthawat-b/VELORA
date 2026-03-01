import controller from "@/controller/order/method";
import { Request, Response } from "express";

async function createOrder(req: Request, res: Response) {
    const data = await controller.createOrder(req.body);
    return res.status(data.code).json(data);
}

async function getOrdersByUser(req: Request, res: Response) {
    const data = await controller.getOrdersByUser(req.params.userId as string);
    return res.status(data.code).json(data);
}

async function getOrdersByShop(req: Request, res: Response) {
    const data = await controller.getOrdersByShop(req.params.shopId as string);
    return res.status(data.code).json(data);
}

async function updateOrderStatus(req: Request, res: Response) {
    const { status } = req.body;
    const data = await controller.updateOrderStatus(req.params.orderId as string, status);
    return res.status(data.code).json(data);
}

export default { createOrder, getOrdersByUser, getOrdersByShop, updateOrderStatus };
