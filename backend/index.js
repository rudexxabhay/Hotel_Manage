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
app.use(cors({origin: "https://hotel-management-1-11ac.onrender.com",
<<<<<<< HEAD
              credentials: true
             }));
=======
    credentials: true
   }));
>>>>>>> 285962f (Initial commit)



app.get("/",(req,res)=>{
    res.send("Done!!")
})

app.use("/user", authRouter)
app.listen(PORT, (req,res)=>{
     console.log(`App is listen on port ${PORT}`)
})
