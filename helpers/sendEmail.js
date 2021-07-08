const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  name: "mail.thedailysicha.com",
  host: "mail.thedailysicha.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: "theds@thedailysicha.com",
    pass: "ZRcxd}Yq2qM4"
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