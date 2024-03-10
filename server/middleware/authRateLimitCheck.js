import { Temp } from "../models/Temp.js";

export default async function authRateLimitCheck(req, res, next){
    const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress || 
    req.connection.socket.remoteAddress;

    const tempIP = await Temp.exists({'value.ip': ip});

    if(!tempIP){
        console.log('here');
        next();
    } else {
        return res.status(429).json({ message: "We have sended an email with verification to you" });
    }
}