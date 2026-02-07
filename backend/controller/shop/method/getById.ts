import Shop from "../../../model/shop";
import { successRes, errRes } from "../../main";

export default async function getById(id: string) {
    try {
        const shop = await Shop.findById(id).select('-shopPassword -shopIDcard');
        if (!shop) {
            return errRes.DATA_NOT_FOUND({ message: "Shop not found" });
        }
        return successRes(shop);
    } catch (error) {
        console.error("Get shop by ID error", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: "Internal server error" });
    }
}
