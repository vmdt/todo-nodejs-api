const {google} = require('googleapis');
const nodemailer = require("nodemailer");

const CLIENT_ID = process.env.GG_CLIENT_ID;
const CLIENT_SECRET = process.env.GG_CLIENT_SECRET;
const REDIRECT_URI = process.env.GG_REDIRECT_URL;
const REFRESH_TOKEN = process.env.GG_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const sendMail = async (options) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_FROM,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            text: options.text
        }
        
        return await transport.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;
