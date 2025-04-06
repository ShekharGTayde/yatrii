import mongoose from "mongoose";


const rideSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    captain:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Captain',
      
    },
    pickup:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    fare:{
        type:Number,
        required:true
    },
    distance:{
        type:Number,
       
    },
    duration:{
        type:Number,
        
    },
    status:{
        type:String,
        enum:['pending','Accepted','Completed','Cancel','Ongoing'],
        default:'pending'
    },
    paymentId:{
        type:String,
       
    },
    orderId:{
        type:String,
       
    },
    signature:{
        type:String
    },
    otp:{
        type:String,
        required:true,
        select:false
    }
},{timestamps:true})


const Ride = mongoose.model('Ride',rideSchema)

export default Ride