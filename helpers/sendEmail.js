const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  name: "thedailysicha.com",
  host: "thedailysicha.com",
  port: 80,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "yoch@thedailysicha.com",
    pass: "qwert"
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

const sendEmail = async (emailOptions) => {
  let emailTransporter = transporter;
  const info = await emailTransporter.sendMail(emailOptions);
  console.log(info);
};


module.exports = sendEmail;