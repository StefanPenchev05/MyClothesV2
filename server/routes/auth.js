import express from "express";

/* REGISTER */
import registerController from "../controllers/auth/registerController.js";
import authRateLimitCheck from "../middleware/authRateLimitCheck.js";
import verifyRegisterUser from "../controllers/auth/verifyUser.js";

/* LOGIN */
import LoginController from "../controllers/auth/loginController.js"

/* SHARED MIDDLEWARE */
import parseUserAgent from "../middleware/parseUserAgent.js";


const authRouter = express.Router();

/* REGISTER */
authRouter.post('/register', authRateLimitCheck, parseUserAgent, registerController);
/* VERIFY REGISTER USER */
authRouter.get('/verify/:token', verifyRegisterUser);

/* LOGIN */
authRouter.post('/login', parseUserAgent, LoginController);

export default authRouter;
