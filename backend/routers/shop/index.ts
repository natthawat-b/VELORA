import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/register", resFunc.register);
routers.post("/login", resFunc.login);
routers.get("/:id", resFunc.getShopById);

export default routers;