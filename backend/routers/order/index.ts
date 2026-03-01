import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/", resFunc.create);
routers.get("/user", resFunc.getByUser);

export default routers;
