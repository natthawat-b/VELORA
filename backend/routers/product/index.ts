import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/add", resFunc.addproduct);
routers.get("/", resFunc.getproduct);

export default routers;  