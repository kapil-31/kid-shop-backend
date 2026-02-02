import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'

const app  = express();
const logger = morgan("tiny")
app.use(cors());
app.use(logger)

app.use(express.json())
app.use(cookieParser());


export default app;