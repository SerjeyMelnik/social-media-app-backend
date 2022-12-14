import express from 'express'
import mongoose from 'mongoose'
import router from './router.js';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser'
import { allowCrossDomain } from './MiddleWares.js';
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import errorMiddleware from './middlewares/error-middleware.js';
dotenv.config()

const PORT = process.env.PORT || 3080;
const app = express();
const DB_URL = process.env.DB_URL;

app.use(express.json())
app.use(bodyParser.json())
app.use(fileUpload())
app.use(cookieParser())
app.use(express.static('static'))
app.use('/api', router)
app.use(allowCrossDomain);
app.use(errorMiddleware)

async function startApp() {
	try {
		await mongoose.connect(DB_URL)
		app.listen(PORT, () => { console.log(`server start at port :${PORT}`); })
	}
	catch (e) {
		console.log(e);
	}
}
startApp()