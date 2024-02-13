import nodemailer from "nodemailer"
import * as aws from "@aws-sdk/client-ses"
import hbs from "nodemailer-express-handlebars"
import path from 'path'

const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};


const ses = new aws.SES(
    
)

const transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp-relay.gmail.com",
    port:587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

transporter.use('compile', hbs(handlebarOptions))

export default async function send(userData,template,pdf=null){
    let file = {};
    if(template == 'raport'){
        file ={
            filename:`sessions-${userData.fullname}-${userData.gameStarted.at(-1)}.pdf`,
            path:`./views/pdfs/sessions-${userData.fullname}-${userData.gameStarted.at(-1)}.pdf`
        }
    }
    const info = await transporter.sendMail({
        from: ' "Toni From Fellowbot" <toni@fellow-bot.com>',
        to:`${userData.email}`,
        subject: "Your driving session",
        template: template,
        context:{
            name: userData.fullname,
            password: userData.password
        },
        attachments:[file]
    }, (error,info) =>{
        if(error){
            console.error("Error while sending email: ", error)
        }else{
            console.log('Email sentt: ', info.response)
        }
    })
}