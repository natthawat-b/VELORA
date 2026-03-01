import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/add", resFunc.addproduct);
routers.post("/search", resFunc.searchproduct); // Add search route
routers.get("/", resFunc.getproduct);
routers.get("/:id", resFunc.getProductById); // Get single product by ID
routers.post("/:id/like", resFunc.toggleLike); // Like/unlike product
routers.delete("/:id", resFunc.deleteproduct);
routers.put("/:id", resFunc.editproduct);

export default routers;  