import express from "express";
import addFunc from "./addFunc";

const routers = express.Router();

routers.post("/add", addFunc.addproduct);

export default routers;  