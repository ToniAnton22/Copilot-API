import userServices from "../models/services/user.service.js"
const userService = new userServices()

export async function createUser(req,res){
    const event = req.body;
    const userData= event.data.object;
    try{
        const user = await userService.createUser(userData)
        res.status(201).json(user)
    }catch(e){
        res.status(500).send(e.message)
    }
}

export async function findUserById(req,res){
    try{
        const user = await userService.findUserId(req.headers['id'])
        console.log(user)
        if(user){
            res.status(200).send("User does exist in the database")
        }else{
            res.status(400).send("User doesn't exist. Abandoning token creation.")
        }
    }catch(e){
        console.error(e.message)
        req.status(500).send("An server error has occured")
    }
}

export async function findSessionByEmail(req,res){
    try{
        const sessions = await userService.findSessionByEmail(req.body)
        if(sessions){
            res.status(200).send("OK")
        }else{
            res.status(404).send("User not found!")
        }

    }catch(e){
        console.error(e.message)
        res.status(500).json({"message":"Server Error"})
    }
}

export async function updateUser(req,res){
    let event
    if(req?.body?.data){
        event = req?.body?.data?.object
    }else{
        event = req?.data?.object
    }
    try{
        

       await userService.updateUserByEmail(event)
       console.log("Found and done")
       res.status(201).send("Finished")
        
    }catch(e){
        console.warn(e.message)
        res.status(500).json({"message":"Server Error"})
    }
}

export async function sendSession(req,res){
    const session =req.body
    try{
         
        const response = await userService.createSession(session)
        if(response){
            return res.status(200).send(response)
        }
        return res.status(403).send("Something went wrong!")
        
    }catch(e){
        console.warn(e.message)
        res.status(500).json({"Message":e.message})
    }
}