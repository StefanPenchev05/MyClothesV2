// Import necessary modules
import { User } from "../../models/User.js";
import { Temp } from "../../models/Temp.js";
import jwt from "jsonwebtoken";

export default async function verifyUser(req, res) {
  try {
    // Extract the token from the request parameters
    const verificationToken = req.params.token;

    // If no token is provided, return an error
    if (!verificationToken) {
      return res.status(400).json({ message: "No token provided" });
    }

    let decoded;
    try {
      // Verify the token using the secret key
      decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
    } catch (err) {
      // If the token is invalid, log the error and return an error response
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find the temporary user data associated with the token
    const tempUserData = (await Temp.findOne({ key: decoded.uuid }, "value"))[
      "value"
    ];

    // If no temporary user data was found, the token is invalid or expired
    if (!tempUserData) {
      return res
        .status(401)
        .json({ message: "Invalid token, your time has expired" });
    }

    // Create a new user with the temporary user data
    const newUser = new User({
      firstName: tempUserData.firstName,
      lastName: tempUserData.lastName,
      email: tempUserData.email,
      username: tempUserData.username,
      password: tempUserData.password,
    });
    await newUser.save();

    // Delete the temporary user data
    await Temp.deleteOne({ key: decoded.uuid });

    // Send a success response
    return res.status(200).json({ message: "Successfily verified" });
  } catch (err) {
    // If an error occurred, log the error and send an error response
    return res.status(500).json({ message: "An error occurred" });
  }
}
