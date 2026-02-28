import { successRes, errRes } from "../../main";
import User from "../../../model/user";
import { IUser } from "../../../types/user";

export default async function register(data: IUser) {
  try {
    // ตรวจสอบข้อมูลที่จำเป็นก่อน
    if (!data.name || !data.name.trim()) {
      return errRes.BAD_REQUEST({ message: "กรุณากรอกชื่อ" });
    }

    if (!data.username || !data.username.trim()) {
      return errRes.BAD_REQUEST({ message: "กรุณากรอกชื่อผู้ใช้" });
    }

    if (!data.email || !data.email.trim()) {
      return errRes.BAD_REQUEST({ message: "กรุณากรอกอีเมล" });
    }

    if (!data.password) {
      return errRes.BAD_REQUEST({ message: "กรุณากรอกรหัสผ่าน" });
    }

    if (!data.phone || !data.phone.trim()) {
      return errRes.BAD_REQUEST({ message: "กรุณากรอกเบอร์โทรศัพท์" });
    }

    // เช็คว่าเบอร์โทรขึ้นต้นด้วย 0
    if (!data.phone.startsWith('0')) {
      return errRes.BAD_REQUEST({ message: "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0" });
    }

    // เช็คว่าไม่มีตัวเลขซ้ำกันเกิน 6 ตัว
    const digitCounts: Record<string, number> = {};
    for (const char of data.phone) {
      digitCounts[char] = (digitCounts[char] || 0) + 1;
      if (digitCounts[char] > 6) {
        return errRes.BAD_REQUEST({ message: "เบอร์โทรศัพท์ห้ามมีตัวเลขซ้ำกันเกิน 6 ตัว" });
      }
    }

    // 1. เช็คว่ารหัสผ่านมีแค่ตัวอักษรและตัวเลขเท่านั้น
    if (!/^[a-zA-Z0-9]+$/.test(data.password)) {
      return errRes.BAD_REQUEST({ message: "รหัสผ่านใส่ได้แค่ตัวอักษรภาษาอังกฤษและตัวเลขเท่านั้น" });
    }

    // 2. เช็คความยาวรหัสผ่าน (ต้องมีอย่างน้อย 6 ตัว)
    if (data.password.length < 6) {
      return errRes.BAD_REQUEST({ message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" });
    }

    // 2. เช็คตัวอักษรพิมพ์ใหญ่ (ต้องมีอย่างน้อย 1 ตัว)
    const hasUpperCase = /[A-Z]/.test(data.password);
    if (!hasUpperCase) {
      return errRes.BAD_REQUEST({ message: "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว" });
    }

    // เช็คว่า Username หรือ Email ซ้ำไหม
    const existingUser = await User.findOne({
      $or: [{ username: data.username }, { email: data.email }]
    });

    if (existingUser) {
      return errRes.BAD_REQUEST({ message: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว" });
    }

    // สร้าง User ใหม่
    const newUser = await User.create(data);
    const formatdeta = {
      name: newUser.name,
      username: newUser.username,
      password: newUser.password,
      email: newUser.email,
      phone: newUser.phone,
      _id: newUser.id,
      success: true
    }
    console.log(newUser)

    return successRes(formatdeta);

  } catch (error: any) {
    console.log(error)

    // แปลง Mongoose validation error เป็นภาษาไทย
    if (error.name === 'ValidationError') {
      const field = Object.keys(error.errors)[0];
      const fieldNames: Record<string, string> = {
        name: 'ชื่อ',
        username: 'ชื่อผู้ใช้',
        email: 'อีเมล',
        password: 'รหัสผ่าน',
        phone: 'เบอร์โทรศัพท์'
      };
      const thaiName = fieldNames[field] || field;
      return errRes.BAD_REQUEST({ message: `กรุณากรอก${thaiName}` });
    }

    // Duplicate key error (E11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        return errRes.BAD_REQUEST({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
      }
      if (field === 'username') {
        return errRes.BAD_REQUEST({ message: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" });
      }
      return errRes.BAD_REQUEST({ message: "ข้อมูลนี้ถูกใช้งานแล้ว" });
    }

    return errRes.INTERNAL_SERVER_ERROR({ message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" });
  }
}