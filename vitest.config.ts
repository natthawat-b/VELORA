import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    
    // 1. กำหนดให้ Vitest วิ่งเฉพาะไฟล์เทสในโฟลเดอร์ src
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    
    // 2. ยกเว้นโฟลเดอร์ e2e-testing ของ Playwright ไม่ให้ Vitest เข้าไปยุ่ง
    exclude: ['**/node_modules/**', '**/e2e-testing/**'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
    },
  },
});