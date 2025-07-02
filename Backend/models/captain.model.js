import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const captainSchema = new mongoose.Schema({
    captainName: {
        type: String,
        required: true,
        minlength: [3, 'username must be at least 3 characters']
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
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vehicle: {
        color: {
            type: String,
            required: true
        },
        vehicleType: {
            type: String,
            enum: ['car', 'bike', 'auto']
        },
        plate: {
            type: String,
            required: true
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'capacity must be at least 1']
        }
    },
    location: {
        ltd: {
            type: Number  
        },
        lng: {
            type: Number
        }
    }
})




//generate token
captainSchema.methods.generateToken = function () {
    const token = jwt.sign(
        { _id: this._id }, //payload
        process.env.JWT_SECRET,//secret
        {
            expiresIn: process.env.JWT_SECRET_EXPIRY //expiry
        }
    )
    return token
}
//compare password
captainSchema.methods.isCorrectPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}
//hash password
captainSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password,5)
}


const Captain = mongoose.model('Captain', captainSchema)
export default Captain

