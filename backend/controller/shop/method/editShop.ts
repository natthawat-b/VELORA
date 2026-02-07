import { successRes, errRes } from "../../main";
import Shop from "../../../model/shop";

export default async function editShop(id: string, data: any) {
    try {
        // Find shop by ID
        const shop = await Shop.findById(id);
        
        if (!shop) {
            return errRes.DATA_NOT_FOUND({ message: "ไม่พบร้านค้า" });
        }

        // Update allowed fields
        if (data.shopname) shop.shopname = data.shopname;
        if (data.shopEmail) shop.shopEmail = data.shopEmail;
        if (data.shopPhone) shop.shopPhone = data.shopPhone;
        if (data.shopBank) shop.shopBank = data.shopBank;
        if (data.shopBankNumber) shop.shopBankNumber = data.shopBankNumber;
        if (data.shopPhoto !== undefined) shop.shopPhoto = data.shopPhoto; // Allow updating photo

        // Save updated shop
        await shop.save();

        console.log('Shop saved, shopPhoto exists:', !!shop.shopPhoto);
        console.log('shopPhoto length:', shop.shopPhoto?.length);

        // Convert to plain object to ensure all fields are included
        const shopObject = shop.toObject();
        
        console.log('Return object has shopPhoto:', !!shopObject.shopPhoto);

        return successRes({
            _id: shopObject._id,
            shopname: shopObject.shopname,
            shopEmail: shopObject.shopEmail,
            shopPhone: shopObject.shopPhone,
            shopPhoto: shopObject.shopPhoto
        });
    } catch (error: any) {
        console.error("Edit shop error:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}
