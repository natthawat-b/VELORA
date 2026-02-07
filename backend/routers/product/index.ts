import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/add", resFunc.addproduct);
routers.get("/", resFunc.getproduct);
routers.get("/:id", resFunc.getProductById);
routers.post("/search", resFunc.searchproduct);

export default routers;  