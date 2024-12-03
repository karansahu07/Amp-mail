const path = require('path')
require("dotenv").config({path:path.join(__dirname,"..","..",".env.dev")}); //for developement purpose only. Please change env name for production
const Queue = require("bull");
const nodemailer = require("nodemailer");

console.log(process.env)

const mailQueue = new Queue("mailQueue", "redis://127.0.0.1:6379"); // Ensure this matches your Redis setup

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
});

mailQueue.process(async (job, done) => {
  const { to, subject, html } = job.data;
  if (to.length <= 0) return done();
  const mailOptions = {
    from: process.env.MAILER_MAIL,
    to: process.env.NODE_ENV!="production"?["malkeetk075@gmail.com"]:to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    done(); // Signal completion of the job
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    done(error); // Pass the error to the queue for retries or logging
  }
});

const express = require("express");
const app = express();

app.get("/service", (req, res) => {
  res.status(200).send("Email service is up and running");
});

const PORT = process.env.MAIL_PORT || 8001;
app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
});
