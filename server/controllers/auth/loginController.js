import bcrypt from "bcrypt";

import { User } from "../../models/User.js";
import { Settings } from "../../models/Settings.js";
import { encrypt } from "../../utils/securityUtils.js";

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export default async function LoginController(req,res){
    const { usernameOrEmail, password, rememberMe } = req.body;

    // Check if the username or email field is empty
    if(usernameOrEmail.length <= 0){
        // If it is, return a 401 status code (Unauthorized) and a message
        return res.status(401).json({message: "Email or Username cannot be empty"});
    } 
    // Check if the password field is empty
    else if(password.length <= 0){
        // If it is, return a 401 status code (Unauthorized) and a message
        return res.status(401).json({message: "Password cannot be empty"});
    }

    try{
        //search for a user by either username or email
        const user = await User.findOne({
            $or: [
                {username: usernameOrEmail},
                {email: usernameOrEmail}
            ]
        });

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        // Compare the plaintext password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({ message: "Incorrect password"});
        }

        if(rememberMe){
            req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;
        }

        // Fetch the user's settings
        const userSettings = await Settings.findOne({userId : user._id});

        // Check if user settings exist
        if(!userSettings){
            // If not, throw an error
            throw new Error();
        }

        // Get the two-factor authentication settings
        const twoFactorAuth = userSettings.security.twoFactorAuth;

        // Check if two-factor authentication is enabled
        if(twoFactorAuth.enabled){

            // Encrypt the user's ID
            const encryptedUserId = encrypt(user._id);

            // If two-factor authentication is required, return a response indicating that
            // an email with a code has been sent and the user can enter it
            return res.status(200).json({
                // Indicate that two-factor authentication is required and make the client to await and join into socket room
                twoFactorAuth: true, 
                // Provide a message to the user
                message : "We have sent an email with a code, you can enter it here",
                // Include the encrypted user ID in the response in order to connect to the socket room
                encryptedUserId
            });
        }

        // Set the user's ID in the session. This will persist across requests
        // as long as the session is active. You can use this to check if the user is logged in.
        req.session.user = user._id;
      
        return res.status(200).json({message: "Successfully logged in user!"});

    }catch(err){
        return res.status(500).json({ message: "An error occurred" });
    }
}