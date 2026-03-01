import Product from "@/model/product";
import { errRes, successRes } from "@/controller/main";

async function toggleLike(productId: string, action: string) {
  try {
    if (!productId) {
      return errRes.BAD_REQUEST({ message: "กรุณาระบุ productId" });
    }

    const increment = action === 'like' ? 1 : -1;
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { likeCount: increment } },
      { new: true }
    );

    if (!product) {
      return errRes.DATA_NOT_FOUND({ message: "ไม่พบสินค้า" });
    }

    // ไม่ให้ likeCount ติดลบ
    if ((product as any).likeCount < 0) {
      await Product.findByIdAndUpdate(productId, { likeCount: 0 });
    }

    return successRes({ likeCount: (product as any).likeCount });
  } catch (error) {
    return errRes.INTERNAL_SERVER_ERROR({ message: "เกิดข้อผิดพลาด" });
  }
}

export default toggleLike;
