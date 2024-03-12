import { User } from "../../models/User.js";
import bcrypt from "bcrypt";

export default async function LoginController(req,res){
    const { usernameOrEmail, password, rememberMe } = req.body;

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

        req.sesssion.user = user._id;

        return res.status(200).json({message: "Successfully logged in user!"});

    }catch(err){
        return res.status(500).json({ message: "An error occurred" });
    }
}