import { registerController } from "../controllers/auth/registerController.js";
import verifyUser from "../controllers/auth/verifyUser.js";
import express from "express";

const authRouter = express.Router();

/* REGISTER */
authRouter.post('/register', registerController);
/* VERIFY REGISTER USER */
authRouter.get('/verify/:token', verifyUser);

export default authRouter;
