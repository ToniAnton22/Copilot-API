import dbConnect from '../../controllers/dbConnect.js'
import UserModel from '../../schema/userSchema.js'




export default class UserDao{
    async create(user){
        try{
            await dbConnect()
            const userCreated = new UserModel(user)
            await userCreated.save()
        }catch(e){
            console.log("databse awaiting before query results in ",e)
        }

    }

    async findSessionsByEmail(email){
        try{
            await dbConnect()
            const sessions = await UserModel.findOne({email})
            return sessions
        }catch(e){
            console.error("Database experiences the following error: ",e)
        }
    }
    
    async findUserEmail(queryParams){
        try{
            await dbConnect()
            const user= await UserModel.findOne({email:queryParams})
           
            return user
        }catch(e)
        {
            console.log("databse awaiting before query results in ",e)
        }

    }
    
    async updateUser(ids,queryParams){
        await dbConnect()
        return await UserModel.findOneAndUpdate({email:ids}, queryParams)
    }
}
