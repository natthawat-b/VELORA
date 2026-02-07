import express from "express";
import addFunc from "./addFunc";

const routers = express.Router();

routers.post("/add", addFunc.addproduct);
routers.get("/all", addFunc.getAllProducts);
routers.get("/shop/:shopId", addFunc.getProductsByShop);
routers.get("/:id", addFunc.getProductById);

export default routers;  