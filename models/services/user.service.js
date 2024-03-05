import repositorys from '../repository/user.js'
import mongoose from 'mongoose';
import timeCalculator from '../../lib/timeCalculator.js';
import generatePassword from "../../lib/generatePassword.js";
import send from '../../controllers/mailer.js';
import {createPdf, createSessionPdf} from '../../controllers/createPdf.js';
import fs from 'fs/promises'

var User = mongoose.model("credentials")
const repository = new repositorys()

export default class UserService{
    createUser(user){
        return new Promise(function(resolve, reject){
            let userCreated = new User(user)
            repository.create(user).then(data =>{
                resolve({data:data})
            }).catch(err => {reject(err)})
        })
    }
    
    findUserByEmail(email){
        return new Promise(function(resolve, reject){
            
            repository.findUserEmail(email).then(data =>{
                resolve({data:data})
            }).catch(err => {reject(err)})
        })
    }
    
    createSession(data){
        return new Promise(function(resolve,reject){
            try{
                if(data){
                    createSessionPdf(data).then(pdf =>{
                        console.log("PDF created")
                        if(pdf == undefined){
                            send(data,"password",null)
                        }else{
                        send(data,"raport",pdf)
                        }
                        console.log("Email Sent")
                        setTimeout(()=>{
                            fs.unlink(`./views/pdfs/sessions-${data?.studentName}-${data?.timeStarted}-${data?.timeEnded}.pdf`)
                            
                        },1350)
                        resolve("Success")
                    })
                    
                }else{
                    resolve(null)
                }
            }catch(e){
                console.warn("The following error has been produced -> " + e)
                reject(e)
            }
        })
    }

    findSessionByEmail(sessions){
        return new Promise(function(resolve,reject){
  
            repository.findUserEmail(sessions.email).then(data =>{
                if(data){
                    createPdf(data,sessions).then(pdf =>{
                        console.log("PDF created")
                        if(pdf == undefined){
                            send(data,"password",null)
                        }else{
                            send(data,"raport",pdf)
                        }
                        console.log("Email Sent")
                        setTimeout(()=>{
                            fs.unlink(`./views/pdfs/sessions-${data?.fullname}-${data?.gameStarted.at(-1)}.pdf`)
                            
                        },750)
                        resolve("Success")
                    })
                    
                }else{
                    resolve(null)
                }
                
            }).catch(err => {reject(err)})
        })
    }

    updateUserByEmail(event){
        return new Promise( async function(resolve, reject){
            try{
                let userData;
                let tokens=1;
                let password = generatePassword()
                let findUsers = await repository.findUserEmail("nodnafornow@gmail.com")
              
                if(findUsers?.tokens){
                    tokens = 1 + findUsers?.tokens 
                }
                userData= {
                    password: password,
                    email: "nodnafornow@gmail.com",
                    fullname: event.shipping.name,
                    yearlyExpiry: timeCalculator(new Date()),
                    expiresOn: new Date(),
                    createdAt: new Date(event.created),
                    plan: "Token",
                    sessions: [{
                        studentName: event.shipping.name,
                        timeStarted: new Date(),
                        timeEnd: new Date(),
                        grade: 100,
                        mistakes: [{
                            mistakeType:'Not stopping at stop',
                            penalty:10,
                            time: new Date(),
                            map:"none"
                        }]
                    },
                    {
                        timeStarted: new Date(),
                        timeExit: new Date(),
                        grade: 45,
                        mistakes:[{
                            mistakeType:'Not stopping at stop',
                            penalty:5,
                            time: new Date(),
                            map:"none"
                        }]
                    }
                ],
                    paidStatus: event.status,
                    tokens: tokens,
                    gameStarted: [String],
                    gameExit:[String]
                };
               
            if(!findUsers){
                console.log("I haven't found one")
                //repository.create(userData)
                //send(userData)
                return resolve("Success")
            }else{
                console.log("I will update")
                repository.updateUser(userData.email,userData)
                send(userData,"password")
                return resolve("done")
            }
          
            }catch(e){
                console.warn(e.message)
                reject(e)
            }
        })
    }
}



