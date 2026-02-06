import controller from "@/controller/user/method";
import { IUser } from "@/types/user";
import { Request, Response } from "express";

async function register(req: Request, res:Response) {
    const data = await controller.register(req.body);
    return res.status(data.code).json(data);
}

async function login(req: Request, res:Response) {
    return controller.login(req, res);
}

export default {
    register,
    login,
};
