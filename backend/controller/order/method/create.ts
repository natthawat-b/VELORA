import Order from "../../../model/order";
import Wallet from "../../../model/wallet";
import Product from "../../../model/product";
import { errRes, successRes } from "@/controller/main";

async function create(body: any) {
  try {
    if (!body.userId || !body.items || body.items.length === 0) {
      return errRes.BAD_REQUEST({ message: "กรุณาระบุข้อมูลคำสั่งซื้อให้ครบถ้วน" });
    }

    if (!body.shippingAddress) {
      return errRes.BAD_REQUEST({ message: "กรุณาระบุที่อยู่จัดส่ง" });
    }

    // สร้าง orderId อัตโนมัติแบบเดิม
    const lastOrder = await Order.findOne({}).sort({ createdAt: -1 }).lean();
    let nextId = 1;
    if (lastOrder && lastOrder.orderId) {
        const num = parseInt(lastOrder.orderId.replace('ORD', ''), 10);
        if (!isNaN(num)) nextId = num + 1;
    }
    const orderId = 'ORD' + String(nextId).padStart(6, '0');

    // สร้าง tracking number อัตโนมัติ (ของใหม่)
    const trackingNumber = `VLR${Date.now()}`;

    const order = await Order.create({
      userId: body.userId,
      items: body.items,
      shippingAddress: body.shippingAddress,
      shippingMethod: body.shippingMethod || "standard",
      shippingCost: body.shippingCost || 0,
      insuranceCost: body.insuranceCost || 0,
      paymentMethod: body.paymentMethod || "promptpay",
      totalPrice: body.totalPrice || body.totalAmount, // รองรับทั้งสองแบบ
      status: "picked_up", // ใช้ status ใหม่ตามไฟล์ create.ts
      orderId,
      trackingNumber,
    });

    // Credit each shop's wallet with their portion (จากโค้ดเดิม)
    const shopTotals: Record<string, { total: number; items: string[] }> = {};
    for (const item of body.items) {
        const sid = item.shopId || 'unknown';
        if (!shopTotals[sid]) shopTotals[sid] = { total: 0, items: [] };
        // รองรับทั้ง price และ productPrice
        const itemPrice = item.price || item.productPrice || 0;
        const itemTotal = item.type === 'rent'
            ? itemPrice * (item.rentalDays || 1) * item.quantity
            : itemPrice * item.quantity;
        shopTotals[sid].total += itemTotal;
        shopTotals[sid].items.push(item.productName || item.productname || 'Unknown');
    }

    // Add income to each shop's wallet
    for (const [shopId, info] of Object.entries(shopTotals)) {
        if (shopId === 'unknown') continue;
        
        // เราต้องการ import Wallet ถ้ายังไม่มี เราจะเพิ่มด้านบนด้วย multi_replace_file_content แต่เดี๋ยวเอา import ไปเพิ่มทีหลัง
        // สำหรับตอนนี้ assume ว่าเราจะแก้ไข import ด้านบนด้วย
        let wallet = await Wallet.findOne({ shopId });
        if (!wallet) {
            wallet = await Wallet.create({ shopId, balance: 0, transactions: [] });
        }

        wallet.balance += info.total;
        wallet.transactions.push({
            type: 'income',
            amount: info.total,
            description: `คำสั่งซื้อ ${orderId}: ${info.items.join(', ')}`,
            orderId: orderId,
            status: 'completed',
            createdAt: new Date()
        } as any);
        await wallet.save();
    }

    // Deduct stock for each product and delete if stock reaches 0 (จากโค้ดเดิม)
    for (const item of body.items) {
        const pId = item.productId || item.id; // เผื่อเรียกต่างกัน
        if (!pId) continue;
        const product = await Product.findById(pId);
        if (product) {
            (product as any).productStock = ((product as any).productStock ?? 1) - (item.quantity || 1);
            if ((product as any).productStock <= 0) {
                await Product.findByIdAndDelete(pId);
            } else {
                await product.save();
            }
        }
    }

    return successRes(order);
  } catch (error: any) {
    return errRes.INTERNAL_SERVER_ERROR({
      message: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
      payload: error.message,
    });
  }
}

export default create;
