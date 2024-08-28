import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import userRouter from './routers/user.routes';
import restoranRouter from './routers/restoran.routes';
import { UserController } from './controllers/user.controller';

new UserController().setDefaultProfilePicture();

const app = express();
app.use(cors())
app.use(express.json())
const router=express.Router()

mongoose.connect('mongodb://127.0.0.1:27017/restoran')
const conn=mongoose.connection
conn.once('open',()=>{console.log("DB connected")})

app.use('/',router)

router.use('/users',userRouter)
router.use('/restaurants',restoranRouter)

app.listen(4000, () => console.log(`Express server running on port 4000`));