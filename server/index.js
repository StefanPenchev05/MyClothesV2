import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import { registerController } from "./controllers/auth/registerController.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
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

/* REGISTER */
app.post('/auth/register', registerController);

/* MONGO SETUP */
const PORT = process.env.PORT || 3000;
console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  }).catch((error) => {
    console.log(`The DataBase did not connect because ${error}`);
  });
