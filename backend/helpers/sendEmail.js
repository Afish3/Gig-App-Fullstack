const nodemailer = require('nodemailer');
let pass = "gcvp anuh wvpi bned";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gig4bears@gmail.com',
    pass: 'gcvpanuhwvpibned',
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'gig4bears@gmail.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendEmail };