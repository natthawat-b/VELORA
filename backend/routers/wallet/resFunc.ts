import controller from "@/controller/wallet/method";
import { Request, Response } from "express";

async function getWallet(req: Request, res: Response) {
    const data = await controller.getWallet(req.params.shopId as string);
    return res.status(data.code).json(data);
}

async function requestWithdrawal(req: Request, res: Response) {
    const { shopId, amount } = req.body;
    if (!shopId || !amount) {
        return res.status(400).json({ success: false, error: { message: "shopId and amount are required" } });
    }
    const data = await controller.requestWithdrawal(shopId, parseFloat(amount));
    return res.status(data.code).json(data);
}

export default { getWallet, requestWithdrawal };
