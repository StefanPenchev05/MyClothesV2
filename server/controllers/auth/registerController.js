import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { Validator } from "../../utils/validator.js";

export async function registerController(req, res) {
  const { email, username, password } = req.body;

  const isEmailValid = await Validator.isEmail(email).then(() => true).catch(() => false);
  if (!isEmailValid) {
    return res.status(400).json({ message: "Email is not valid" });
  }

  if(!Validator.isUsername(username)){
    return res.status(400).json({ message: "Username is not valid" });
  }

  const isPasswordValid = Validator.isPassword(password);
  if(typeof isPasswordValid === "string"){
    return res.status(400).json({ message: `${isPasswordValid}` });
  }

  return res.status(200).json({ email, username, password });
}
