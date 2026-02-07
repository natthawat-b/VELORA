import { successRes, errRes } from "../../main";
import Cart from "../../../model/cart";
import Product from "../../../model/product";

// เพิ่มสินค้าลงตะกร้า
export async function addToCart(data: any) {
    try {
        const { userId, productId, quantity, size, rentalDays } = data;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // สร้างตะกร้าใหม่ถ้ายังไม่มี
            cart = await Cart.create({
                userId,
                items: [{ productId, quantity, size, rentalDays }]
            });
        } else {
            // เช็คว่ามีสินค้านี้ในตะกร้าหรือยัง (เช็ค productId, size, rentalDays)
            const itemIndex = cart.items.findIndex((item: any) => 
                item.productId.toString() === productId && 
                item.size === size && 
                item.rentalDays === rentalDays
            );

            if (itemIndex > -1) {
                // ถ้ามีแล้ว เพิ่มจำนวน
                cart.items[itemIndex].quantity += quantity;
            } else {
                // ถ้ายังไม่มี เพิ่มใหม่
                cart.items.push({ productId, quantity, size, rentalDays });
            }
            await cart.save();
        }

        return successRes(cart);
    } catch (error: any) {
        console.error("Error adding to cart:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: "Failed to add to cart" });
    }
}

// ดึงข้อมูลตะกร้า
export async function getCart(userId: string) {
    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!cart) {
            // ถ้าไม่มีตะกร้า Return ตะกร้าว่าง
            return successRes({ items: [] });
        }

        return successRes(cart);
    } catch (error: any) {
        console.error("Error fetching cart:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: "Failed to fetch cart" });
    }
}

// อัพเดทจำนวนสินค้า
export async function updateCartItem(data: any) {
    try {
        const { userId, productId, size, rentalDays, quantity } = data;

        if (quantity < 1) {
             return errRes.BAD_REQUEST({ message: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return errRes.DATA_NOT_FOUND({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex((item: any) => 
            item.productId.toString() === productId && 
            item.size === size && 
            item.rentalDays === rentalDays
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            // Return updated cart with population for frontend update
            await cart.populate('items.productId');
            return successRes(cart);
        } else {
            return errRes.DATA_NOT_FOUND({ message: "Item not found in cart" });
        }

    } catch (error: any) {
        console.error("Error updating cart:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: "Failed to update cart" });
    }
}

// ลบสินค้าออกจากตะกร้า
export async function removeFromCart(data: any) {
    try {
        const { userId, productId, size, rentalDays } = data;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return errRes.DATA_NOT_FOUND({ message: "Cart not found" });
        }

        // Filter items to remove the specific one
        cart.items = cart.items.filter((item: any) => 
            !(item.productId.toString() === productId && 
              item.size === size && 
              item.rentalDays === rentalDays)
        );

        await cart.save();
        await cart.populate('items.productId');
        return successRes(cart);

    } catch (error: any) {
        console.error("Error removing from cart:", error);
        return errRes.INTERNAL_SERVER_ERROR({ message: "Failed to remove from cart" });
    }
}
