const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');

dotenv.load();
console.log('service', process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail() {
    
}

module.exports = {

}