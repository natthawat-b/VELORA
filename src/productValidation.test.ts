import { describe, it, expect } from "vitest";
import { validateProductPrice } from "./productValidation";

/**
 * Test Scenario 1: Add Product - ช่องราคาสินค้า/ราคาเช่า (ECP + BVA)
 */
describe("Test Scenario 1: Add Product - Price and Rent Price Validation", () => {

  // ==========================================
  // Group 1: Equivalence Class Partitioning (ECP)
  // ==========================================

  it("Test case 1: EC-01 - ราคาขายอยู่ในช่วงที่ถูกต้อง (Valid Equivalence Class)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า (เตรียม Mock Data)
    const input = { price: 500, isRentable: false };

    // Step 2: กรอกราคาขายเป็นค่ากลางของช่วงที่ถูกต้อง (500) และส่งข้อมูล
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result (ระบบบันทึกสำเร็จ ไม่มี Error)
    expect(result).toBe("");
  });

  it("Test case 2: EC-02 - ราคาขายต่ำกว่าขั้นต่ำ (Invalid Equivalence Class - ต่ำเกินไป)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    const input = { price: -50, isRentable: false };

    // Step 2: กรอกราคาขายเป็นค่าติดลบ (-50) และกดบันทึก
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result
    expect(result).toBe("กรุณากรอกราคาสินค้าที่ถูกต้อง");
  });

  it("Test case 3: EC-03 - ราคาขายสูงกว่าขั้นสูงมาก (Invalid Equivalence Class - สูงเกินไป)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    const input = { price: 99999999, isRentable: false };

    // Step 2: กรอกราคาขายเป็นค่าสูงมาก (99,999,999) และกดบันทึก
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result
    expect(result).toBe("ราคาสินค้าต้องไม่เกิน 10,000,000 บาท");
  });

  it("Test case 4: EC-04 - กรอกราคาเป็นตัวอักษร/ไม่ใช่ตัวเลข (Invalid Equivalence Class)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    const input = { price: "abc", isRentable: false };

    // Step 2: กรอกราคาขายเป็นข้อความ ("abc") และกดบันทึก
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result
    expect(result).toBe("กรุณากรอกราคาสินค้าที่ถูกต้อง");
  });

  it("Test case 5: EC-05 - ปล่อยช่องราคาว่างไว้ (Invalid Equivalence Class - ค่าว่าง)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    const input = { price: "", isRentable: false };

    // Step 2: เว้นช่องราคาขายว่างไว้ และกดบันทึก
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result
    expect(result).toBe("กรุณากรอกราคาสินค้าที่ถูกต้อง");
  });

  // ==========================================
  // Group 2: Boundary Value Analysis (BVA) - Selling Price
  // ==========================================

  it("Test case 6: BV-01 - ราคาขาย = 0 (ค่าต่ำกว่าขอบล่างพอดี 1 หน่วย)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    const input = { price: 0, isRentable: false };

    // Step 2: กรอกราคาขาย = 0 และกดบันทึก
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result
    expect(result).toBe("กรุณากรอกราคาสินค้าที่ถูกต้อง");
  });

  it("Test case 7: BV-02 - ราคาขาย = 1 (ขอบล่างพอดี - ค่าต่ำสุดที่ยอมรับได้)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    const input = { price: 1, isRentable: false };

    // Step 2: กรอกราคาขาย = 1 และกดบันทึก
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result
    expect(result).toBe("");
  });

  it("Test case 8: BV-03 - ราคาขาย = 2 (สูงกว่าขอบล่างพอดี 1 หน่วย)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    const input = { price: 2, isRentable: false };

    // Step 2: กรอกราคาขาย = 2 และกดบันทึก
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result
    expect(result).toBe("");
  });

  it("Test case 9: BV-04 - ราคาขาย = 9,999,999 (ต่ำกว่าขอบบนพอดี 1 หน่วย)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    const input = { price: 9999999, isRentable: false };

    // Step 2: กรอกราคาขาย = 9,999,999 และกดบันทึก
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result
    expect(result).toBe("");
  });

  it("Test case 10: BV-05 - ราคาขาย = 10,000,000 (ขอบบนพอดี - ค่าสูงสุดที่ยอมรับได้)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    const input = { price: 10000000, isRentable: false };

    // Step 2: กรอกราคาขาย = 10,000,000 และกดบันทึก
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result
    expect(result).toBe("");
  });

  it("Test case 11: BV-06 - ราคาขาย = 10,000,001 (สูงกว่าขอบบนพอดี 1 หน่วย)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    const input = { price: 10000001, isRentable: false };

    // Step 2: กรอกราคาขาย = 10,000,001 และกดบันทึก
    const result = validateProductPrice(input);

    // Step 3: ตรวจสอบ Expected Result
    expect(result).toBe("ราคาสินค้าต้องไม่เกิน 10,000,000 บาท");
  });

  // ==========================================
  // Group 3: Boundary Value Analysis (BVA) - Rent Price
  // ==========================================

  it("Test case 12: BV-07 - ราคาเช่า = 0 เมื่อเลือกให้เช่าได้ (ขอบล่างของราคาเช่า)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    // Step 2: เปิดตัวเลือก "ให้เช่าได้" (isRentable = true)
    // Step 3: กรอกราคาเช่า = 0
    // Step 4: กดบันทึก
    const input = { price: 500, isRentable: true, rentPrice: 0 };

    const result = validateProductPrice(input);

    // Expected Result: ระบบแสดงข้อความ Error ราคาเช่าต้องอย่างน้อย 1 บาท
    expect(result).toBe("ราคาเช่าต้องมีค่าอย่างน้อย 1 บาท/วัน");
  });

  it("Test case 13: BV-08 - ราคาเช่า = 1 เมื่อเลือกให้เช่าได้ (ขอบล่างพอดี)", () => {
    // Step 1: เข้าหน้าลงขายสินค้า
    // Step 2: เปิดตัวเลือก "ให้เช่าได้" (isRentable = true)
    // Step 3: กรอกราคาเช่า = 1
    // Step 4: กดบันทึก
    const input = { price: 500, isRentable: true, rentPrice: 1 };

    const result = validateProductPrice(input);

    // Expected Result: บันทึกสำเร็จ
    expect(result).toBe("");
  });

});