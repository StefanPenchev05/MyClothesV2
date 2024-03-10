import nodemailer from "nodemailer"

/**
 * This fucntion sends an email for verifying when registration
 * 
 * @param {string} email 
 * @param {string} token 
 */

export default function sendVerifyMail(email, token, username){
    try {
        // Define email options, including sender, recipient, subject, and message body
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: `Verify Email for username: ${username}`,
            html: `
                <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; font-family: Arial, sans-serif;">
                    <h2 style="text-align: center; color: #333; font-size: 24px;">Welcome, ${username}!</h2>
                    <p style="color: #555; font-size: 16px;">Please verify your email address by clicking the link below:</p>
                    <a href="http://localhost:3000/auth/verify/${token}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
                </div> 
            `,
        };

        // Create a transporter for sending emails using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',             // Email service provider
            auth: {
                user: process.env.NODEMAILER_EMAIL,  // Sender's email address
                pass: process.env.NODEMAILER_PASSWORD // Sender's email password
            }
        });

        // Send the email using the configured transporter
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                throw new Error("Error during sending email");
            }

            return info.response;
        });
    } catch (err) {
        throw err;
    }
}