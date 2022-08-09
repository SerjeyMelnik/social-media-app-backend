import mongoose from "mongoose";

const User = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isActivated: { type: Boolean, required: true, default: false },
	activationLink: { type: String }
})

export default mongoose.model("User", User);

