import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/add", resFunc.addproduct);
routers.get("/", resFunc.getproduct);
routers.get("/:id", resFunc.getproduct); // Get single product by ID
routers.delete("/:id", resFunc.deleteproduct);
routers.put("/:id", resFunc.editproduct);

export default routers;  