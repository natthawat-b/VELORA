import Order from "@/model/order";
import { errRes, successRes } from "@/controller/main";

async function getByUser(userId: string) {
  try {
    if (!userId) {
      return errRes.BAD_REQUEST({ message: "กรุณาระบุ userId" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return successRes(orders);
  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ",
      payload: error.message,
    });
  }
}

export default getByUser;
