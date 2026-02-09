import cors from "cors";


const corsOption: cors.CorsOptions = {
  origin: "https://velora-mu-vert.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
  ],
};


export default cors(corsOption);
