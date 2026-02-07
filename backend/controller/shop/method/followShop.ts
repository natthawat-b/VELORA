import { successRes, errRes } from "../../main";
import Shop from "../../../model/shop";

export default async function followShop(shopId: string, userId: string, action: 'follow' | 'unfollow') {
    try {
        const shop = await Shop.findById(shopId);
        
        if (!shop) {
            return errRes.DATA_NOT_FOUND({ message: "Shop not found" });
        }

        // Initialize followers array if it doesn't exist
        if (!shop.followers) {
            shop.followers = [];
        }

        const isFollowing = shop.followers.includes(userId);

        if (action === 'follow') {
            if (isFollowing) {
                return errRes.BAD_REQUEST({ message: "Already following this shop" });
            }
            shop.followers.push(userId);
        } else if (action === 'unfollow') {
            if (!isFollowing) {
                return errRes.BAD_REQUEST({ message: "Not following this shop" });
            }
            shop.followers = shop.followers.filter(id => id !== userId);
        }

        await shop.save();

        return successRes({
            followerCount: shop.followers.length,
            isFollowing: action === 'follow'
        });
    } catch (error) {
        console.error("Follow shop error:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: "Internal server error" });
    }
}
