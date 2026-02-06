import express from "express";
import config from "./config";
import { connectDB } from "./database";
import middleware from "./middleware";
import userRouters from "./routers/user";
import productRouters from "./routers/product";

const app = express();
const { HOST_API_PORT } = config;
app.use(middleware.cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();


app.use("/api/product", productRouters);
app.use("/api/user", userRouters);
app.get("/", (req, res) => res.send("ยินดีต้อนรับสู่ API"));



app.listen(HOST_API_PORT, () => {
  console.log(`Server is running on port ${HOST_API_PORT}`);
});
