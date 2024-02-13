import pkg from 'mongoose'

const {Schema, models, model} = pkg


var userSchema = new Schema({
    fullname: String,
    password: String,
    email: String,
    yearlyExpiry: Date,
    createdAt: Date,
    gameStarted:[String],
    gameEnded:[String],
    crashedDates:[String],
    expiresOn:Date,
    sessions: [{
        studentName: String,
        timeStarted: String,
        timeEnded: String,
        grade: Number,
        mistakes: [{
            mistakeType: String,
            penalty: Number,
            time: String,
            map:String
        }]
    }],
    paidStatus: String,
    tokens:Number

})

export default (models.credentials) || model("credentials",userSchema)