import { successRes, errRes } from "../../main";
import Shop from "../../../model/shop";

export default async function getAllShops() {
    try {
        const shops = await Shop.find({}).select('shopname shopEmail shopusername');
        return successRes(shops);
    } catch (error: any) {
        console.error("Get all shops error:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
