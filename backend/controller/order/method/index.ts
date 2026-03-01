import { successRes, errRes } from "../../main";
import Order from "../../../model/order";
import Wallet from "../../../model/wallet";
import Product from "../../../model/product";

// Create a new order and credit shop wallets
async function createOrder(data: any) {
    try {
        // Generate order ID
        const lastOrder = await Order.findOne({}).sort({ createdAt: -1 }).lean();
        let nextId = 1;
        if (lastOrder && lastOrder.orderId) {
            const num = parseInt(lastOrder.orderId.replace('ORD', ''), 10);
            if (!isNaN(num)) nextId = num + 1;
        }
        const orderId = 'ORD' + String(nextId).padStart(6, '0');

        const order = await Order.create({
            ...data,
            orderId,
            status: 'paid'
        });

        // Credit each shop's wallet with their portion
        // Group items by shopId
        const shopTotals: Record<string, { total: number; items: string[] }> = {};
        for (const item of data.items) {
            const sid = item.shopId || 'unknown';
            if (!shopTotals[sid]) shopTotals[sid] = { total: 0, items: [] };
            const itemTotal = item.type === 'rent'
                ? item.price * (item.rentalDays || 1) * item.quantity
                : item.price * item.quantity;
            shopTotals[sid].total += itemTotal;
            shopTotals[sid].items.push(item.productName);
        }

        // Add income to each shop's wallet
        for (const [shopId, info] of Object.entries(shopTotals)) {
            if (shopId === 'unknown') continue;
            
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

        // Deduct stock for each product and delete if stock reaches 0
        for (const item of data.items) {
            console.log('Processing item for stock deduction:', { productId: item.productId, quantity: item.quantity });
            if (!item.productId) {
                console.log('Skipping item - no productId');
                continue;
            }
            const product = await Product.findById(item.productId);
            console.log('Found product:', product ? { id: product._id, name: (product as any).productname, stock: (product as any).productStock } : 'NOT FOUND');
            if (product) {
                (product as any).productStock = ((product as any).productStock ?? 1) - (item.quantity || 1);
                console.log('New stock:', (product as any).productStock);
                if ((product as any).productStock <= 0) {
                    console.log('Deleting product:', item.productId);
                    await Product.findByIdAndDelete(item.productId);
                } else {
                    await product.save();
                }
            }
        }

        return successRes(order);
    } catch (error: any) {
        console.error("Create Order Error:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

// Get orders by user
async function getOrdersByUser(userId: string) {
    try {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
        return successRes(orders);
    } catch (error: any) {
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

// Get orders by shop
async function getOrdersByShop(shopId: string) {
    try {
        const orders = await Order.find({ 'items.shopId': shopId }).sort({ createdAt: -1 }).lean();
        return successRes(orders);
    } catch (error: any) {
        return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
    }
}

// Update order status
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

export default { createOrder, getOrdersByUser, getOrdersByShop, updateOrderStatus };
