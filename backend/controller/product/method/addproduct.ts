import { successRes, errRes } from "../../main";
import Product from "../../../model/product";
import { IProduct } from "../../../types/product";

export default async function addproduct(data: Omit<IProduct, 'productid'>) {
    try {
        // 1. หา productid ล่าสุด (ดึงเฉพาะ field productid เพื่อความเร็ว)
        const lastProduct = await Product.findOne({}, { productid: 1 })
            .sort({ productid: -1 })
            .lean();

        // 2. คำนวณ ID ถัดไป
        let nextId = 1;
        if (lastProduct && lastProduct.productid) {
            const currentId = parseInt(lastProduct.productid, 10);
            if (!isNaN(currentId)) {
                nextId = currentId + 1;
            }
        }

        // 3. Format ให้เป็น 0001, 0002...
        const formattedId = String(nextId).padStart(4, '0');

        // 4. สร้าง Product ใหม่
        const newProduct = await Product.create({
            ...data,
            productid: formattedId
        });

        return successRes(newProduct);

    } catch (error: any) {
        console.error("Add Product Error:", error);
        
        // เช็คเผื่อกรณีเกิด Duplicate Key Error จาก MongoDB (ถ้าตั้ง unique: true ไว้)
        if (error.code === 11000) {
            return errRes.BAD_REQUEST({ message: "Product ID already exists. Please try again." });
        }

        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}