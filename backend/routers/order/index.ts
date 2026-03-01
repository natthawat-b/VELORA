import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/create", resFunc.createOrder);
routers.get("/user/:userId", resFunc.getOrdersByUser);
routers.get("/shop/:shopId", resFunc.getOrdersByShop);
routers.put("/:orderId/status", resFunc.updateOrderStatus);

export default routers;
