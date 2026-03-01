import { Request, Response } from "express";
import { successRes, errRes } from "../../main";
import Shop from "../../../model/shop";
import { IShop } from "../../../types/shop";

export default async function login(req: Request, res: Response) {
    try {
        const { shopusername, shopPassword } = req.body;
        // ค้นหาทั้ง shopusername และ shopname เพื่อรองรับข้อมูลเก่า
        const shop = await Shop.findOne({
            $or: [
                { shopusername: shopusername },
                { shopname: shopusername }
            ]
        });
        if (!shop) {
            return res.status(404).json(errRes.DATA_NOT_FOUND({ message: "ไม่พบผู้ใช้นี้" }));
        }
        if (shop.shopPassword !== shopPassword) {
            return res.status(401).json(errRes.BAD_REQUEST({ message: "Invalid password" }));
        }
        
        // Update lastActive timestamp
        shop.lastActive = new Date();
        await shop.save();
        
        // Return shop data with userType for role-based navigation
        const shopData = {
            _id: shop._id,
            shopname: shop.shopname,
            shopEmail: shop.shopEmail,
            userType: 'shop'
        };
        
        return res.status(200).json(successRes(shopData));
    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json(errRes.INTERNAL_SERVER_ERROR({ message: "Internal server error" }));
    }
}
