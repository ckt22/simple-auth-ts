import 'dotenv/config';
import sgMail from '@sendgrid/mail';

console.log('service', process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface message {
    to: string,
    from: string, // Use the email address or domain you verified above
    subject: string,
    text: string,
    html: string
  };
export async function sendEmail(msg: message) {
    try {
        await sgMail.send(msg);
    } catch (e) {
        console.log(e);
    }

}