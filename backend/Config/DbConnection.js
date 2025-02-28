import mongoose from 'mongoose';

const url = process.env.MONGO_URL;
const connectDB = async()=>{

    mongoose.connection.on("connected",()=>{
        console.log("Database Connected");
    })
    await mongoose.connect(url)
}

export default connectDB;