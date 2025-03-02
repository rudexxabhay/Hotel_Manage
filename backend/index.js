import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import "dotenv/config";
import cookieParser from 'cookie-parser';   
import connectDB from './Config/DbConnection.js';
import { authRouter } from './Route/AuthRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
app.use(express.json());
app.use(cookieParser());
<<<<<<< HEAD
app.use(cors({origin: "http://localhost:5173",
              credentials: true
             }));
=======
app.use(cors({origin: "https://rudexx.vercel.app",
    credentials: true
   }));
>>>>>>> 208632d0a01401ae1d10e37efd1892b1d8cd1c23


app.get("/",(req,res)=>{
    res.send("Done!!")
})

app.use("/user", authRouter)
app.listen(PORT, (req,res)=>{
     console.log(`App is listen on port ${PORT}`)
})
