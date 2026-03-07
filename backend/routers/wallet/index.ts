import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.get("/:shopId", resFunc.getWallet);
routers.post("/withdraw", resFunc.requestWithdrawal);

export default routers;
