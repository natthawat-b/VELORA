// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
 
  
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  testDir: './tests', // หมายความว่าให้ไปหาไฟล์เทสเฉพาะในโฟลเดอร์ tests เท่านั้น

  use: {
    // 2. Base URL สำหรับเรียกใช้งานในโค้ดเทส เช่น await page.goto('/')
    baseURL: 'http://localhost:5173', 
    screenshot: 'on',
    video: 'on-first-retry',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // ถ้าอยากเทสเร็วๆ ในเครื่องตัวเอง อาจจะคอมเมนต์ firefox/webkit ไว้ก่อนได้ครับ
  ],

  /* ส่วนที่แก้ไขเพิ่มความเสถียร */
 webServer: {
    // 1. แก้ Path: ต้องเป็น ../VELORA (ตัวพิมพ์ใหญ่ตามรูป) และ /frontend
    command: 'npm run dev --prefix ../VELORA/frontend', 
    
    // 2. แก้ Port: เปลี่ยนเป็น 5174 ตามที่ Vite แจ้งว่าพอร์ต 5173 ถูกใช้ไปแล้ว
    url: 'http://localhost:5173',
    
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120 * 1000,
  },
});