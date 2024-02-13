import express from 'express'
import {updateUser} from  '../controllers/user.js'

const userRoutes = express.Router();

userRoutes.post('/update',updateUser)


export default userRoutes
