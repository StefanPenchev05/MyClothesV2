import express from "express";

/* REGISTER */
import registerController from "../controllers/auth/registerController.js";
import authRateLimitCheck from "../middleware/authRateLimitCheck.js";
import verifyUser from "../controllers/auth/verifyUser.js";

/* LOGIN */
import LoginController from "../controllers/auth/loginController.js"


const authRouter = express.Router();

/* REGISTER */
authRouter.post('/register', authRateLimitCheck, registerController);
/* VERIFY REGISTER USER */
authRouter.get('/verify/:token', verifyUser);

/* LOGIN */
authRouter.post('/login', LoginController);

export default authRouter;
