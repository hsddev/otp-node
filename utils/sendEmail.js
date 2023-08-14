// Dependencies
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOpts = {
        from: "E-shop App <contact@thehungrybread.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3) Send email
    await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
