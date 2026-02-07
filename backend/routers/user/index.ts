import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/register", resFunc.register);
routers.post("/login", resFunc.login);
// routers.put("/edit", resFunc.edit);

export default routers;