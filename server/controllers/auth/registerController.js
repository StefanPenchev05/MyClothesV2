import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import setTempMemory from "../../utils/mongoTempMemoryService.js"
import sendVerifyMail from "../../utils/emailService.js";

import { User } from "../../models/User.js";
import { Validator } from "../../utils/validator.js";

async function generateUniqueUsername(username) {
  let newUsername = username;
  let userExists = true;

  while (userExists) {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    newUsername = `${username}${randomNumber}`;
    userExists = await User.exists({ username: newUsername });
  }

  return newUsername;
}

export async function registerController(req, res) {
  const { firstName, lastName, email, username, password } = req.body;

  const errors = [];

  const isFirstAndLastNameValid = Validator.isFirstAndLastName(firstName, lastName);
  if (typeof isFirstAndLastNameValid === "string") {
    errors.push(isFirstAndLastNameValid);
  }

  const isEmailValid = await Validator.isEmail(email).then(() => true).catch(() => false);
  if (!isEmailValid) {
    errors.push("Email is not valid");
  }

  if (!Validator.isUsername(username)) {
    errors.push("Username is not valid");
  }

  const isPasswordValid = Validator.isPassword(password);
  if (typeof isPasswordValid === "string") {
    errors.push(isPasswordValid);
  }

  if (password === username) {
    errors.push("The password and username cannot be the same");
  }

  if (password.replace(/[^a-zA-Z]+/g, "").includes(username.replace(/[^a-zA-Z]+/g, ""))) {
    errors.push("Password should not contain the username");
  }

  if (errors.length > 0) {
    return res.status(400).json({ messages: errors });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 12);
    
    const verificationToken = jwt.sign({username}, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Save the user data temporarily in Redis with a 15 minute expiry
    await setTempMemory(verificationToken, {
        firstName,
        lastName,
        email,
        username,
        password: hashPassword
    }, 60 * 15).then(() => {
        // Send the email with the link to verification
        console.log('sending email...')
        sendVerifyMail(email, verificationToken, username);
    }).catch(err => {
        throw err;
    });
   
    return res.status(200).json({ email, username });
  } catch (err) {
    console.log(err)
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