import express from "express";
import resFunc from "./resFunc";

const routers = express.Router();

routers.post("/start", resFunc.startChat);
routers.post("/send", resFunc.sendMessage);
routers.get("/list/:participantId", resFunc.getChatList);
routers.get("/:chatId", resFunc.getMessages);

export default routers;
