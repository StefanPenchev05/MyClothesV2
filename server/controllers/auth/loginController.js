import { User } from "../../models/User.js";
import bcrypt from "bcrypt";

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

        // Set the user's ID in the session. This will persist across requests
        // as long as the session is active. You can use this to check if the user is logged in.
        req.session.user = user._id;
      
        return res.status(200).json({message: "Successfully logged in user!"});

    }catch(err){
        return res.status(500).json({ message: "An error occurred" });
    }
}