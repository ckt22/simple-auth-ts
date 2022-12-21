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
export async function sendEmail(msg: message): Promise<boolean> {
    try {
        const resp = await sgMail.send(msg);
        console.log(resp);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}