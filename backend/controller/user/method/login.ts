import { Request, Response } from "express";
import { successRes, errRes } from "../../main";
import User from "../../../model/user";
import { IUser } from "../../../types/user";

export default async function login(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json(errRes.DATA_NOT_FOUND({ message: "User not found" }));
        }
        if (user.password !== password) {
            return res.status(401).json(errRes.BAD_REQUEST({ message: "Invalid password" }));
        }
        // ไม่ส่ง password กลับไป
        const { password: _, ...userData } = user.toObject();
        return res.status(200).json(successRes(userData));
    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json(errRes.INTERNAL_SERVER_ERROR({ message: "Internal server error" }));
    }
}
