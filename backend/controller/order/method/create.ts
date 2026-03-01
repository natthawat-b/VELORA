import Order from "@/model/order";
import { errRes, successRes } from "@/controller/main";

async function create(body: any) {
  try {
    if (!body.userId || !body.items || body.items.length === 0) {
      return errRes.BAD_REQUEST({ message: "กรุณาระบุข้อมูลคำสั่งซื้อให้ครบถ้วน" });
    }

    if (!body.shippingAddress) {
      return errRes.BAD_REQUEST({ message: "กรุณาระบุที่อยู่จัดส่ง" });
    }

    // สร้าง tracking number อัตโนมัติ
    const trackingNumber = `VLR${Date.now()}`;

    const order = await Order.create({
      userId: body.userId,
      items: body.items,
      shippingAddress: body.shippingAddress,
      shippingMethod: body.shippingMethod || "standard",
      shippingCost: body.shippingCost || 0,
      insuranceCost: body.insuranceCost || 0,
      paymentMethod: body.paymentMethod || "promptpay",
      totalPrice: body.totalPrice,
      status: "picked_up",
      trackingNumber,
    });

    return successRes(order);
  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({
      message: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
      payload: error.message,
    });
  }
}

export default create;
