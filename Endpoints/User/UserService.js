
import User from '../../Schemes/User.js';
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import MailService from './MailService.js';
import UserDto from '../../dtos/userDto.js'
import TokenService from './TokenService.js';
import ApiError from '../../exceptions/ApiError.js';



class UserService {
	async registration(name, email, password) {
		const candidateName = await User.findOne({ name });
		if (candidateName) {
			throw ApiError.BadRequest(`Name <span>${candidateName.name}</span> is not available, choose another.`)
		}
		const candidateEmail = await User.findOne({ email });
		if (candidateEmail) {
			throw ApiError.BadRequest(`The user with this email is already registered`)
		}
		const hashPassword = await bcrypt.hash(password, 3);
		const activationLink = uuidv4();

		const user = { name, email, password: hashPassword, activationLink };
		const createdUser = await User.create(user);

		await MailService.sendActivationMail(email, process.env.API_URL + '/api/activate/' + activationLink);

		const userDto = new UserDto(createdUser);

		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto
		};
	}

	async activate(activationLink) {
		const user = await User.findOne({ activationLink });

		if (!user) {
			throw ApiError.BadRequest('Incorrect activate link')
		}
		user.isActivated = true;
		await user.save()
	}

	async login(email, password) {
		const user = await User.findOne({ email });
		if (!user) {
			throw ApiError.BadRequest('User with this email is not registered')
		}

		const isPassCorrect = await bcrypt.compare(password, user.password);

		if (!isPassCorrect) {
			throw ApiError.BadRequest('Password is not correct')
		}

		const userDto = new UserDto(user);

		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto
		};

	}

	async logout(refreshToken) {
		const token = await TokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}
		const userData = TokenService.validateRefreshToken(refreshToken);
		const tokenFromDB = await TokenService.findTokenInDB(refreshToken);

		if (!userData || !tokenFromDB) {
			throw ApiError.UnauthorizedError()
		}
		const user = await User.findById(userData._id);
		const userDto = new UserDto(user);
		const tokens = TokenService.generateTokens({ ...userDto });
		await TokenService.saveToken(userDto.id, tokens.refreshToken);

		return {
			...tokens,
			user: userDto
		};
	}



	async getAllUsers() {
		const users = await User.find();
		return users.reverse();
	}
	async getById(id) {
		if (!id) {
			throw ApiError.BadRequest('Id is not specified')
		}
		const user = await User.findById(id);
		return user

	}

	async update(userId, user) {

		if (!userId) {
			throw new Error('Id is not specified')
		}
		const updatedUser = await User.findByIdAndUpdate(postId, user, { new: true })
		return updatedUser;

	}
	async delete(id) {

		if (!id) {
			throw new Error('Id is not specified')
		}
		const deletedUser = await User.findByIdAndDelete(id)
		return deletedUser

	}
}

export default new UserService();