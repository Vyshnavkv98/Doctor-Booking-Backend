import express from 'express';

import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import * as middlewares from './middlewares';
import api from './controller';
import MessageResponse from './interfaces/MessageResponse';
import connectDb from "./db/mongoose"
import userRouter from "./express-router/user"
import adminRouter from './express-router/admin'
import doctorRouter from './express-router/doctor'
import fileRouter from './express-router/file'
import cookieParser from 'cookie-parser';
import nocache from 'nocache';
import busboy from 'connect-busboy';
import stripe from 'stripe';



const app = express();


connectDb()



app.use(cors())
app.use('/webhook', express.raw({ type: 'application/json' })) 
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024,

}));

app.use(nocache())
app.use(userRouter, adminRouter, fileRouter, doctorRouter)


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
