import cors from "cors";


const corsOption: cors.CorsOptions = {
  // origin: "https://velora-mu-vert.vercel.app",
  origin: [
    "https://velora-mu-vert.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
  ],
};


export default cors(corsOption);
