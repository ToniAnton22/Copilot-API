import nodemailer from "nodemailer"
//import {SES} from "@aws-sdk/client-ses"
//import * as aws from "@aws-sdk/client-ses"
//import {defaultProvider} from "@aws-sdk/credential-provider-node"
import hbs from "nodemailer-express-handlebars"
import path from 'path'
import fs from 'fs'

const handlebarOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};
// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.



// AWS SES CONFIGURATION BELOW

// const sesClient = new SES({
//     apiVersion:"2014-10-01",
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//     defaultProvider,
    
// });


//const transporter = nodemailer.createTransport({
//    SES: { ses:sesClient, aws },
//    sendingRate:1
//});


// Gooogle configuration below
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    
  });


transporter.use('compile', hbs(handlebarOptions))
export default async function send(userData, template, pdf = null) {
    let attachments = [];
    if (pdf) {
        attachments.push({
            filename: `sessions-${userData.fullname}-${userData.gameStarted.at(-1)}.pdf`,
            path: `./views/pdfs/sessions-${userData.fullname}-${userData.gameStarted.at(-1)}.pdf`,
        });
    }
    try {
        console.log("sending")
        const info = await transporter.sendMail({
            from: `Sida from Fellow-bot <${process.env.EMAIL}>`,
            to: userData.email,
            subject: "Your driving session",
            template: template, // Confirm this matches a `.handlebars` file in `./views/`
            context: {
                name: userData.fullname,
                password: userData.password,
            },
            attachments,
        });

        console.log('Email sent: ', info);
     
    } catch (error) {
        console.error("Error while sending email: ", error);

    }
}