import mongoose from "mongoose";

const connectDb = async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}${process.env.MONGODB_NAME}`)
        console.log(`mongoDb connected successfully at port:${process.env.PORT}`);
        
    } catch (error) {
        console.log('ERROR:',error);
        process.exit(1)
        
    }
}

export default connectDb;