import { test, expect } from '@playwright/test';

test.describe('Registration Page', () => {
  
  test.beforeEach(async ({ page }) => {
    // เปลี่ยนจาก '/' เป็น Path หน้าสมัครสมาชิกของคุณ เช่น '/register'
    await page.goto('/'); 
  });

  test('ควรแสดงฟอร์มสมัครสมาชิกครบถ้วน', async ({ page }) => {
    // ตรวจสอบว่ามีช่องกรอกข้อมูลสำคัญไหม (ปรับตาม id หรือ name ในโค้ดคุณ)
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="nono-button"q]')).toBeVisible();
  });

  test('ไม่ควรสมัครผ่านถ้ากรอก Password ไม่ตรงกัน', async ({ page }) => {
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123456');
    await page.fill('input[name="confirmPassword"]', '654321');
    await page.click('button[type="submit"]');

    // ตรวจสอบ Error message (ปรับตาม class หรือ text ที่คุณใช้)
    const error = page.locator('.text-red-500'); // สมมติว่าใช้ Tailwind class
    await expect(error).toContainText('ไม่ตรงกัน');
  });
});