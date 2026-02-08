import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/register", resFunc.register);
routers.post("/login", resFunc.login);
routers.get("/all", resFunc.getAllShops); // Must be before /:id
routers.get("/:id", resFunc.getShopById);
routers.put("/:id", resFunc.editShop);
routers.put("/:id/follow", resFunc.followShopRoute); // Follow/unfollow shop

export default routers;