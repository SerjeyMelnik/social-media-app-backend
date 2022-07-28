import express from 'express'
import mongoose from 'mongoose'
import router from './router.js';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser'
import { allowCrossDomain } from './MiddleWares.js';

const PORT = process.env.PORT || 3080;
const app = express();
const DB_URL = `mongodb+srv://testBD:testBD@cluster0.ls094.mongodb.net/?retryWrites=true&w=majority`

app.use(express.json())
app.use(bodyParser.json())
app.use(fileUpload())
app.use(express.static('static'))
app.use('/api', router)
app.use(allowCrossDomain);
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