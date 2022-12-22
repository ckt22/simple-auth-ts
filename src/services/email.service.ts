import 'dotenv/config';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface message {
    to: string,
    from: string, // Use the email address or domain you verified above
    subject: string,
    text: string,
    html: string
  };
export async function sendEmail(msg: message): Promise<boolean> {
    try {
        await sgMail.send(msg);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}