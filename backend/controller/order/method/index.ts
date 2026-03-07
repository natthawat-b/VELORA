mimport create from "./create";
import getByUser from "./getByUser";
import { successRes, errRes } from "../../main";
import Order from "../../../model/order";

// Get orders by shop (preserved for SellerProductListPage)
async function getOrdersByShop(shopId: string) {
    try {
        const orders = await Order.find({ 'items.shopId': shopId }).sort({ createdAt: -1 }).lean();
        return successRes(orders);
    } catch (error: any) {
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

// Update order status (preserved for Order Status changes)
async function updateOrderStatus(orderId: string, status: string) {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId },
            { status },
            { new: true }
        );
        if (!order) return errRes.DATA_NOT_FOUND({ message: "Order not found" });
        return successRes(order);
    } catch (error: any) {
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

export default {
  create,
  getByUser,
  getOrdersByUser: getByUser, // alias for backwards compatibility
  createOrder: create, // alias for backwards compatibility
  getOrdersByShop,
  updateOrderStatus
};
