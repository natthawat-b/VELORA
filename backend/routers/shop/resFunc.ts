import { Request, Response } from "express";
import { registerShop as registerShopController, loginShop as loginShopController, getById, editShop as editShopController, getAllShops as getAllShopsController, followShop as followShopController } from "../../controller/shop/method/index";
import { IShop } from "@/types/shop";

interface IdParams {
    id: string;
}

async function register(req: Request, res: Response) {
    const data = await registerShopController(req.body);
    return res.status(data.code).json(data);
}

async function login(req: Request, res: Response) {
    return loginShopController(req, res);
}

async function getShopById(req: Request<IdParams>, res: Response) {
    const data = await getById(req.params.id);
    return res.status(data.code).json(data);
}

async function editShop(req: Request<IdParams>, res: Response) {
    const data = await editShopController(req.params.id, req.body);
    return res.status(data.code).json(data);
}

async function getAllShops(req: Request, res: Response) {
    const data = await getAllShopsController();
    return res.status(data.code).json(data);
}

async function followShopRoute(req: Request<IdParams>, res: Response) {
    const { userId, action } = req.body;
    const data = await followShopController(req.params.id, userId, action);
    return res.status(data.code).json(data);
}

export default {
    register,
    login,
    getShopById,
    editShop,
    getAllShops,
    followShopRoute,
};
