import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/register", resFunc.register);
routers.post("/login", resFunc.login);

export default routers;