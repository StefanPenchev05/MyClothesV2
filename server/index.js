import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import morgan from "morgan";
import RateLimit from "express-rate-limit";
import session from "express-session";

/* SOCKET */
import { initializeSocketIO } from "./sockets/index.js";
import { createServer } from "https";

/* ROUTERS */
import authRouter from "./routes/auth.js";

/* CONFIGURATIONS */
const privateKey = fs.readFileSync("./cert/localhost.key", "utf-8");
const certificate = fs.readFileSync("./cert/localhost.crt", "utf-8");
const credentials = { key: privateKey, cert: certificate };
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});
dotenv.config();
const app = express();
app.use(cors());
app.use(limiter);
app.use(helmet());
app.use(
  session({
    secret: process.env.SESSION_SECTER,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(express.json());
app.use(morgan("common"));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use("assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/assets/");
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

/* REGISTER ROUTER*/
app.use("/auth", authRouter);

/* MONGO SETUP */
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    const httpsServer = createServer(credentials, app);
    initializeSocketIO(httpsServer);

    httpsServer.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((error) => {
    console.log(`The DataBase did not connect because ${error}`);
  });

export default app;
