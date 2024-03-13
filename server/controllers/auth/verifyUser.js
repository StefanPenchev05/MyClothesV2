import jwt from "jsonwebtoken";

import { User } from "../../models/User.js";
import { Temp } from "../../models/Temp.js";
import { getIO } from "../../sockets/index.js";
import { Settings } from "../../models/Settings.js";

/**
 * Verifies a newly registered user.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */

export default async function verifyRegisterUser(req, res) {
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
    } catch (err){
      console.log(err)
      // If the token is invalid, log the error and return an error response
      return res.status(401).json({ message: "Invalid token" });
    }

    let tempUserData;
    try{
      // Find the temporary user data associated with the token
      tempUserData = (await Temp.findOne({ key: decoded.uuid }, "value"))[
        "value"
      ];
    }catch(err){
      return res
          .status(401)
          .json({ message: "Invalid token, your time has expired" });
    }

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

    // Save the new user
    await newUser.save();
    
    // Create a new user settings with the user's ID and account activity
    const newUserSettings = new Settings({
      userId: newUser._id,
      security: {
        accountActivity:[{
          ipAddress: tempUserData.ip,
          device:{
            userAgent: tempUserData.userAgent,
            browser: tempUserData.browser,
            operatingSystem: tempUserData.operatingSystem,
            deviceType: tempUserData.deviceType
          }
        }]
      }
    });

    // Save the new user settings
    await newUserSettings.save();

    // Delete the temporary user data
    await Temp.deleteOne({ key: decoded.uuid });

    // Send a success response
    // Get the Socket.IO server instance
    const io = getIO();

    // Emit a 'verificationComplete' event to the client associated with the decoded token
    // The event data includes a 'verified' property set to true
    io.to(decoded.uuid).emit('verificationComplete', { verified: true });
  } catch (err) {
    console.log(err)
    // If an error occurred, log the error and send an error response
    return res.status(500).json({ message: "An error occurred" });
  }
}

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */

export function verify2FA(req,res){
  const { code } = req.body;

}
