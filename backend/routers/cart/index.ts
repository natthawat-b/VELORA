import express from "express";
import cartFunc from "./cartFunc";

const routers = express.Router();

routers.post("/add", cartFunc.addToCart);
routers.get("/:userId", cartFunc.getCart);
routers.put("/update", cartFunc.updateCartItem);
routers.delete("/remove", cartFunc.removeFromCart); // Axios: { data: { ... } }

export default routers;
