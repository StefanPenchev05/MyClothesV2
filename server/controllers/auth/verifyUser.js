import { Temp } from "../../models/Temp.js";
import jwt from "jsonwebtoken"

export default function verifyUser(req, res){
    const verificationToken = req.params.token;
    console.log("CODEEEEE --------- " + verificationToken);

    //Verify the token
    jwt.verify(verificationToken, process.env.JWT_SECRET,(err, decoded) => {
        if (err) {
            return res.status(500).json({message: err});
        }
        console.log(decoded);

        // Access the decoded information
        const username = decoded.username;
        const ip = decoded.ip;
        console.log(`Username: ${username}, IP: ${ip}`);

        // You can now use the username and ip in your code
    });


    return res.status(200).json({message: "Success"})
};