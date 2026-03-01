import controller from "@/controller/order/method";
import { Request, Response } from "express";

async function create(req: Request, res: Response) {
  const data = await controller.create(req.body);
  return res.status(data.code).json(data);
}

async function getByUser(req: Request, res: Response) {
  const userId = req.query.userId as string;
  const data = await controller.getByUser(userId);
  return res.status(data.code).json(data);
}

export default {
  create,
  getByUser,
};
