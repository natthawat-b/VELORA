import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/velora";
const HOST_API_PORT = process.env.HOST_API_PORT || "3000";

export default {
  DATABASE_URL,
  HOST_API_PORT,
};