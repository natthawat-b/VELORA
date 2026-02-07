import { Request, Response } from "express";
import { successRes, errRes } from "../../main";
import Shop from "../../../model/shop";
import { IShop } from "../../../types/shop";

export default async function login(req: Request, res: Response) {
    try {
        const { shopname, shopPassword } = req.body;
        const shop = await Shop.findOne({ shopname });
        if (!shop) {
            return res.status(404).json(errRes.DATA_NOT_FOUND({ message: "Shop not found" }));
        }
        if (shop.shopPassword !== shopPassword) {
            return res.status(401).json(errRes.BAD_REQUEST({ message: "Invalid password" }));
        }
        // ส่งข้อมูลร้านค้ากลับไปให้ frontend (ไม่รวม password)
        const shopData = {
            _id: shop._id,
            shopusername: shop.shopusername,
            shopname: shop.shopname,
            shopEmail: shop.shopEmail,
            shopPhone: shop.shopPhone
        };
        return res.status(200).json(successRes({ message: "Login successful", data: shopData }));
    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json(errRes.INTERNAL_SERVER_ERROR({ message: "Internal server error" }));
    }
}
