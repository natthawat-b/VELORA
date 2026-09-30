export interface ProductPriceInput {
  price: string | number;
  isRentable?: boolean;
  rentPrice?: string | number;
}

export function validateProductPrice(input: ProductPriceInput): string {
  const { price, isRentable, rentPrice } = input;

  // 1. ตรวจสอบค่าว่าง
  if (price === "" || price === null || price === undefined) {
    return "กรุณากรอกราคาสินค้าที่ถูกต้อง";
  }

  const numPrice = Number(price);

  // 2. ตรวจสอบว่าเป็นตัวเลขหรือไม่
  if (isNaN(numPrice) || typeof price === "boolean") {
    return "กรุณากรอกราคาสินค้าที่ถูกต้อง";
  }

  // 3. ตรวจสอบขอบเขตราคาขาย (1 - 10,000,000 บาท)
  if (numPrice < 1) {
    return "กรุณากรอกราคาสินค้าที่ถูกต้อง";
  }

  if (numPrice > 10000000) {
    return "ราคาสินค้าต้องไม่เกิน 10,000,000 บาท";
  }

  // 4. ตรวจสอบราคาเช่า (ถ้าเปิดตัวเลือกให้เช่าได้)
  if (isRentable) {
    if (rentPrice === "" || rentPrice === null || rentPrice === undefined) {
      return "ราคาเช่าต้องมีค่าอย่างน้อย 1 บาท/วัน";
    }
    const numRentPrice = Number(rentPrice);
    if (isNaN(numRentPrice) || numRentPrice < 1) {
      return "ราคาเช่าต้องมีค่าอย่างน้อย 1 บาท/วัน";
    }
  }

  return ""; // บันทึกสำเร็จ (ไม่มี Error)
}