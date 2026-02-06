import { successRes, errRes } from "../../main";
import Shop from "../../../model/shop";
import { IShop } from "../../../types/shop";

export default async function registerShop(data: IShop) {
  try {
    // 1. เช็คความยาวรหัสผ่าน (ต้องครบ 16 ตัว)
    if (data.shopPassword && data.shopPassword.length < 6) {
      return errRes.BAD_REQUEST({ message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" });
    }

    // 2. เช็คตัวอักษรพิมพ์ใหญ่ (ต้องมีอย่างน้อย 1 ตัว)
    const hasUpperCase = /[A-Z]/.test(data.shopPassword || "");
    if (!hasUpperCase) {
      return errRes.BAD_REQUEST({ message: "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว" });
    }

    // --- Logic เดิมของคุณ ---
    // เช็คว่า Username หรือ Email ซ้ำไหม
    const existingUser = await Shop.findOne({
      $or: [{ shopname: data.shopname }, { shopEmail: data.shopEmail }]
    });

    if (existingUser) {
      return errRes.BAD_REQUEST({ message: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว" });
    }

    // สร้าง User ใหม่
    const newShop = await Shop.create(data);
    const formatdeta = {
      shopusername: newShop.shopusername,
      shopname: newShop.shopname,
      shopEmail: newShop.shopEmail,
      shopPassword: newShop.shopPassword,
      shopPhone: newShop.shopPhone,
      shopIDcard: newShop.shopIDcard,
      shopBank: newShop.shopBank,
      shopBankNumber: newShop.shopBankNumber,

      _id: newShop.id,
      success: true
    }
    console.log(newShop)

    return successRes(formatdeta);

  } catch (error: any) {
    console.log(error)
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}