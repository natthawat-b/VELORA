import express from "express";
import config from "./config";
import { connectDB } from "./database";
import middleware from "./middleware";
import userRouters from "./routers/user";
import productRouters from "./routers/product";
import shopRouters from "./routers/shop";
import chatRouters from "./routers/chat";
import orderRouters from "./routers/order";
import walletRouters from "./routers/wallet";

const app = express();

// 1. ตรวจสอบว่า middleware.cors ของคุณอนุญาต Domain ของ Vercel หรือยัง
app.use(middleware.cors);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
connectDB();

app.use("/api/shop", shopRouters);
app.use("/api/product", productRouters);
app.use("/api/user", userRouters);
app.use("/api/chat", chatRouters);
app.use("/api/order", orderRouters);
app.use("/api/wallet", walletRouters);
app.get("/", (req, res) => res.send("ยินดีต้อนรับสู่ API"));

// --- จุดที่แก้ไข ---
// 2. ต้องดึงค่าจาก process.env.PORT ก่อนเสมอ เพื่อให้ Render กำหนดเลขพอร์ตเองได้
const PORT = Number(process.env.PORT) || Number(config.HOST_API_PORT) || 10000;

// 3. สำคัญมาก: ต้องใส่ "0.0.0.0" เพื่อให้ Server ยอมรับการเชื่อมต่อจากภายนอกบน Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});