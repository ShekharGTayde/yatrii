import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minLength: [3, 'minimun three charachter require']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String,
        default:null
    }
}, { timeStamp: true })


//token generation
userSchema.methods.generateAuthToken = async function (_id) {
   const token =  jwt.sign({
         _id: this._id 
        },
         process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_SECRET_EXPIRY
        })
    return token
}

//password  hashing before saving to db
userSchema.statics.hashPassword = async function (password){
   return this.password = await bcrypt.hash(password,5)
}

//compare user password with database hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    if (!password || !this.password) {
        throw new Error("Password or hash is missing");
    }
    return await bcrypt.compare(password,this.password)
}


const User = mongoose.model('User', userSchema)

export default User;

