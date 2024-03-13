import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"

import setTempMemory from "../../utils/mongoTempMemoryService.js"
import sendVerifyMail from "../../utils/emailService.js";

import { User } from "../../models/User.js";
import { Validator } from "../../utils/validator.js";
import { Temp } from "../../models/Temp.js";

// This function generates a unique username by appending a random number to the provided username
// It checks both the User and Temp collections to ensure the username is unique
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

export default async function registerController(req, res) {
  // Extract user details from the request body
  const { firstName, lastName, email, username, password } = req.body;

  // Array to store any validation errors
  const inputErrors = [];

  // Validate each input field and add any error messages to the inputErrors array
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

  // Check if password and username are the same or if password contains the username
  if (password === username) {
    inputErrors.push("The password and username cannot be the same");
  }

  if (password.replace(/[^a-zA-Z]+/g, "").includes(username.replace(/[^a-zA-Z]+/g, ""))) {
    inputErrors.push("Password should not contain the username");
  }

  // If there are any validation errors, return a 400 status code and the error messages
  if (inputErrors.length > 0) {
    return res.status(400).json({ messages: inputErrors });
  }

  try {
    // Get the user's IP address
    const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           req.connection.socket.remoteAddress;
           
    // Hash the user's password
    const hashPassword = await bcrypt.hash(password, 12);

    // Check if the username is already in use in the Temp collection
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

    // Generate a UUID and a JWT for email verification
    const uuid = uuidv4();
    const verificationToken = jwt.sign({uuid}, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Temporarily store the user's data in Redis with a 15 minute expiry
    // Then send a verification email to the user
    await setTempMemory(uuid, {
        ip,
        firstName,
        lastName,
        email,
        username,
        password: hashPassword
    }, 60 * 15).then(() => {
        sendVerifyMail(email, verificationToken, username);
    }).catch(err => {
        throw err;
    });

    // If everything is successful, return a 200 status code and a success message
    return res.status(200).json({message: "Waiting for you to verify with link sended to your email"})

  } catch (err) {
    // If the username is already taken, suggest a new one by calling the generateUniqueUsername function
    if (err.errors.username) {
      const newUsername = await generateUniqueUsername(username);
      return res
        .status(401)
        .json({
          message: "The username has already been taken. Here is a suggestion for a new one: ",
          newUsername,
        });
    }
    // If there's any other error, return a 401 status code and the error message
    return res.status(401).json({ message: err });
  }
}