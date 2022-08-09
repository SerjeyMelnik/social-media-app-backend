
import UserService from './UserService.js';
import { validationResult } from "express-validator"
import ApiError from '../../exceptions/ApiError.js';

class UserController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				next(ApiError.BadRequest("Validation Error", errors.array()))
			}
			const { name, email, password } = req.body;
			const userData = await UserService.registration(name, email, password);
			res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true })
			return res.json(userData)
		} catch (error) {

			next(error)
		}
	}
	async login(req, res, next) {
		try {
			const { email, password } = req.body;
			const userData = await UserService.login(email, password);
			res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true })
			return res.json(userData)

		} catch (error) {
			next(error)
		}
	}
	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const token = await UserService.logout(refreshToken);
			res.clearCookie('refreshToken');
			return res.json(token)
		} catch (error) {
			next(error)
		}
	}
	async activate(req, res, next) {
		try {
			const activationLink = req.params.link;
			await UserService.activate(activationLink);
			return res.redirect(process.env.CLIENT_URL);
		} catch (error) {
			next(error)
		}
	}
	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const userData = await UserService.refresh(refreshToken);
			res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true })
			return res.json(userData)
		} catch (error) {
			next(error)
		}
	}

	async getAllUsers(req, res, next) {
		try {
			const users = await UserService.getAllUsers()
			res.status(200).json(users)
		} catch (error) {
			next(error)
		}
	}

	async getUserById(req, res) {
		try {
			const user = await UserService.getUserById(req.params.id);
			return res.json(user);
		} catch (error) {
			res.status(500).json(error.message)
		}
	}

	async update(req, res) {
		try {
			const user = req.body;
			const updatedUser = await UserService.update(user._id, user, { new: true })

			return res.json(updatedUser)
		} catch (error) {
			res.status(500).json(error.message)

		}
	}
	async delete(req, res) {
		try {
			const deletedUser = await UserService.delete(req.params.id)
			return res.json(deletedUser)
		} catch (error) {
			res.status(500).json(error.message)

		}
	}
}
export default new UserController()