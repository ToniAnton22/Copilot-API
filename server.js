import express, {json} from 'express'
import Stripe from 'stripe'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import dbConnect from './controllers/dbConnect.js'
import clientPromise from './controllers/mongodb.js'
import {updateUser,findSessionByEmail, sendSession, findUserById} from  './controllers/user.js'
import hbs from "nodemailer-express-handlebars"
import nodemailer from "nodemailer"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import jwt from "jsonwebtoken"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_LIVE_KEY)
const endpointSecret= process.env.STRIPE_ENDPOINT
const app = express()

const viewsPath = join(__dirname, 'views/')

app.engine('handlebars',hbs({
    extname:'.handlebars',
    defaultLayout:false,
}))

app.set('view engine','handlebars')
app.set('views', viewsPath)


const dbConnection = async () =>{
    try{
        await dbConnect()
    }catch(e){
        console.error("Error when trying to connect to db", e)
    }

}
// Routes

app.post('/onComplete',express.raw({type:'application/json'}),async (req,res) =>{
    const signature = req.headers['stripe-signature']

    let client = await clientPromise
    
    let event;
    if(endpointSecret){
        try{
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            )
        }catch(err){
            console.log('Webhook signature verification failed.')
            return res.sendStatus(400)
        }
    }

    switch(event.type){
        case 'payment_intent.succeeded':
            console.log("Started")
            updateUser(event,res)
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log(paymentMethod)
            break;
        case 'payment_intent.payment_failed':
            const paymentFailed = event.data.object;
            console.log(paymentFailed)
            break;
        default:
            console.log(`Unhandled event type ${event.type}`)
           
    }

})

app.use(express.json({limit:"100mb"}))
app.use(express.urlencoded({extended: true}))

const authenticateToken = (req,res,next) => {
    const authHeader = req.headers['authorization'].split(' ')[1]
    const token = jwt.sign({allowed:'true'},authHeader,{algorithm:'HS256'})
    
    if(token==null) return res.sendStatus(401);

    jwt.verify(token, process.env.AUTH_TOKEN, (err, user) =>{
        if(err) return res.status(403).send(err)
        req.allowed = true;
        next()
    })
}

app.post("/sendSession",authenticateToken,(req,res) =>{
    if(!req.allowed){
        console.log("I am not allowed")
        res.sendStatus(403)
    }
    sendSession(req,res)
    req.allowed= false;
    console.log("I am no longer allowed")
    res.status(200)
})

app.post("/sendEmail",authenticateToken,(req,res) =>{
    
    if(!req.allowed){
        console.log("I am not allowed")
        res.sendStatus(403)
    }
    console.log('I am allowed')
    findSessionByEmail(req,res)
    req.allowed= false;
    console.log("I am no longer allowed")
})


app.get('/',(req,res)=>{
    res.send("Server is on")
})

app.get('/api/user/token',async (req,res) =>{
    await findUserById(req,res)

})

app.use("/user", userRoutes)

app.listen(8001, () => console.log('Running on port 8001'))