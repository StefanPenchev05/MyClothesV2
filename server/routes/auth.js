import { registerController } from "../controllers/auth/registerController.js";
import authRateLimitCheck from "../middleware/authRateLimitCheck.js";
import verifyUser from "../controllers/auth/verifyUser.js";
import express from "express";

const authRouter = express.Router();

/* REGISTER */
authRouter.post('/register', authRateLimitCheck, registerController);
/* VERIFY REGISTER USER */
authRouter.get('/verify/:token', verifyUser);

export default authRouter;
