import controller from "@/controller/product/method";
import { IProduct } from "@/types/product";
import { Request, Response } from "express";

// กำหนด type สำหรับ params ที่มี id
interface IdParams {
    id: string;
}

async function addproduct(req: Request<{}, {}, IProduct>, res: Response) {
    const data = await controller.addproduct(req.body);
    return res.status(data.code).json(data);
}

async function deleteproduct(req: Request<IdParams>, res: Response) {
    const data = await controller.deleteproduct(req.params.id);
    return res.status(data.code).json(data);
}

async function editproduct(req: Request<IdParams, {}, IProduct>, res: Response) {
    const data = await controller.editproduct(req.params.id, req.body);
    return res.status(data.code).json(data);
}

async function searchproduct(req: Request<{}, {}, IProduct>, res: Response) {
    const data = await controller.searchproduct(req.body);
    return res.status(data.code).json(data);
}

async function getproduct(req: Request, res: Response) {
    const data = await controller.get(req, res);
    return data;
}

export default {
    addproduct,
    deleteproduct,
    editproduct,
    searchproduct,
    getproduct,
}
