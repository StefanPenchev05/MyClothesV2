import fs from "fs"
import path from "path"
import nodemailer from "nodemailer"
import { fileURLToPath } from "url";

function getHtmlTemplate(htmlTemplate){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatePath = path.join(__dirname, `../../maizzle/build_production/${htmlTemplate}.html`);
    const html = fs.readFileSync(templatePath, 'utf8');
    return html;
}

/**
 * This function sends an email using the provided parameters.
 * It's designed to be reusable, so you can use it to send different types of emails.
 * 
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject line of the email.
 * @param {string} html - The HTML body of the email.
 * 
 * @returns {void}
 */
export default function sendMail(email, subject, htmlTemplate){
    try {
        // Define the options for the email, including the sender's email address,
        // the recipient's email address, the subject line, and the HTML body.
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL, // Sender's email address
            to: email, // Recipient's email address
            subject, // Subject line
            html: getHtmlTemplate(htmlTemplate), // HTML body
        };

        // Create a transporter for sending emails. This uses the 'gmail' service,
        // but you can replace this with any email service that is supported by nodemailer.
        // The authentication for the email service is provided by environment variables.
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Email service provider
            auth: {
                user: process.env.NODEMAILER_EMAIL, // Sender's email address
                pass: process.env.NODEMAILER_PASSWORD // Sender's email password
            }
        });

        // Use the transporter to send the email with the defined options.
        // If there's an error during sending, it will throw an error.
        // Otherwise, it will return the response from the email service.
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                throw new Error("Error during sending email");
            }

            return info.response;
        });
    } catch (err) {
        // If there's an error at any point in the function, it will be thrown so it can be handled by the caller.
        throw err;
    }
}