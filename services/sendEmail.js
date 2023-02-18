"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "puldyastin@gmail.com", // generated ethereal user
      pass: "",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "puldyastin@gmail.com", // sender address
    to: "paulpintang.dev@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  transporter.sendMail(info, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent");
    }
  });
}

main().catch(console.error);

// Password APP
// lqobessgxuztpfgv
