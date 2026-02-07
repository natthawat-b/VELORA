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
