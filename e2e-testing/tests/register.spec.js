import { test, expect } from '@playwright/test';

test.describe('Registration Page', () => {

  test.beforeEach(async ({ page }) => {
    // ไปที่หน้าสมัครสมาชิก
    await page.goto('/register');
  });

  test('ควรแสดงฟอร์มสมัครสมาชิกครบถ้วน', async ({ page }) => {
    // ตรวจสอบว่ามีช่องกรอกข้อมูลสำคัญครบถ้วน
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('ควรกรอกข้อมูลและส่งฟอร์มได้', async ({ page }) => {
    // กรอกข้อมูลครบถ้วน
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', '123456');
    await page.fill('input[name="phone"]', '0812345678');

    // ตรวจสอบว่าค่าในฟอร์มถูกต้อง
    await expect(page.locator('input[name="username"]')).toHaveValue('testuser');
    await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
    await expect(page.locator('input[name="password"]')).toHaveValue('123456');
    await expect(page.locator('input[name="phone"]')).toHaveValue('0812345678');

    // ตรวจสอบว่าปุ่ม submit ใช้งานได้
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });
});