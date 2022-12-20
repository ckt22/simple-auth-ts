import "dotenv/config";
import sgMail from "@sendgrid/mail";

console.log('service', process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function sendEmail() {
    
}