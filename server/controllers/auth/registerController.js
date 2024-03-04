import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { Validator } from "../../utils/validator.js";

export async function registerController(req, res) {
  const { firstName, lastName, email, username, password } = req.body;

  const isFirstAndLastNameValid = Validator.isFirstAndLastName(
    firstName,
    lastName
  );
  if (typeof isFirstAndLastNameValid === "string") {
    return res.status(400).json({ message: isFirstAndLastNameValid });
  }

  const isEmailValid = await Validator.isEmail(email)
    .then(() => true)
    .catch(() => false);
  if (!isEmailValid) {
    return res.status(400).json({ message: "Email is not valid" });
  }

  if (!Validator.isUsername(username)) {
    return res.status(400).json({ message: "Username is not valid" });
  }

  const isPasswordValid = Validator.isPassword(password);
  if (typeof isPasswordValid === "string") {
    return res.status(400).json({ message: `${isPasswordValid}` });
  }

  //check if the username and password are the same
  if (password === username) {
    return res
      .status(200)
      .json({ message: "The password and username caanot be the same" });
  }

  //check if the password contains the username
  if (
    password
      .replace(/[^a-zA-Z]+/g, "")
      .includes(username.replace(/[^a-zA-Z]+/g, ""))
  ) {
    return res
      .status(400)
      .json({ message: "Password should not contain the username" });
  }

  try {
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password,
    });
    await newUser.save();
    return res.status(200).json({ email, password, username });
  } catch (err) {
    if (err.errors.username) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      return res
        .status(401)
        .json({
          message:
            "The user had already been taken here is a suggestion for new one: ",
          newUsername: `${err.errors.username.value}${randomNumber}`,
        });
    }
    return res.status(401).json({ message: err });
  }
}
