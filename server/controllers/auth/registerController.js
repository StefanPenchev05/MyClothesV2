import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"

import setTempMemory from "../../utils/mongoTempMemoryService.js"
import sendVerifyMail from "../../utils/emailService.js";

import { User } from "../../models/User.js";
import { Validator } from "../../utils/validator.js";
import { Temp } from "../../models/Temp.js";

async function generateUniqueUsername(username) {
  let newUsername = username;
  let userExists = true;

  while (userExists) {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    newUsername = `${username}${randomNumber}`;
    userExists = await User.exists({ username: newUsername }) || await Temp.exists({'value.username': newUsername }); 
  }

  return newUsername;
}

export async function registerController(req, res) {
  const { firstName, lastName, email, username, password } = req.body;

  const inputErrors = [];

  const isFirstAndLastNameValid = Validator.isFirstAndLastName(firstName, lastName);
  if (typeof isFirstAndLastNameValid === "string") {
    inputErrors.push(isFirstAndLastNameValid);
  }

  const isEmailValid = await Validator.isEmail(email).then(() => true).catch((err) => err);
  if(typeof isEmailValid === "string"){
    inputErrors.push(isEmailValid);
  }

  const isUseraNameValid = Validator.isUsername(username);
  if (typeof isUseraNameValid === "string") {
    inputErrors.push(isUseraNameValid);
  }

  const isPasswordValid = Validator.isPassword(password);
  if (typeof isPasswordValid === "string") {
    inputErrors.push(isPasswordValid);
  }

  if (password === username) {
    inputErrors.push("The password and username cannot be the same");
  }

  if (password.replace(/[^a-zA-Z]+/g, "").includes(username.replace(/[^a-zA-Z]+/g, ""))) {
    inputErrors.push("Password should not contain the username");
  }

  if (inputErrors.length > 0) {
    return res.status(400).json({ messages: inputErrors });
  }

  try {
    //get the ip of the user
    const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           req.connection.socket.remoteAddress;
           
    const hashPassword = await bcrypt.hash(password, 12);

    //generate a UUID
    const uuid = uuidv4();
    
    const verificationToken = jwt.sign({uuid}, process.env.JWT_SECRET, { expiresIn: '15m' });

    const tempUsername = await Temp.exists({'value.username': username});
    if(tempUsername){
      const error = new Error("Username is temporarily taken");
      error.errors = {
        username: {
          message: "Username is temporarily taken"
        }
      };
      throw error;
    }

    // Save the user data temporarily in Redis with a 15 minute expiry
    await setTempMemory(uuid, {
        firstName,
        lastName,
        email,
        username,
        password: hashPassword
    }, 60 * 15).then(() => {
        // Send the email with the link to verification
        sendVerifyMail(email, verificationToken, username);
    }).catch(err => {
        throw err;
    });
   
    return res.status(200).json({ email, username });
  } catch (err) {
    if (err.errors.username) {
      const newUsername = await generateUniqueUsername(username);
      return res
        .status(401)
        .json({
          message: "The username has already been taken. Here is a suggestion for a new one: ",
          newUsername,
        });
    }
    return res.status(401).json({ message: err });
  }
}