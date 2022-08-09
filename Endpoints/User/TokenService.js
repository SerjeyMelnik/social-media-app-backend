
import jwt from 'jsonwebtoken'
import Token from '../../Schemes/Token.js'
class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn: '30m' });
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: '30d' })
		return {
			accessToken,
			refreshToken
		}

	}

	async saveToken(userId, refreshToken) {
		const tokenData = await Token.findOne({ user: userId });
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save()
		}
		const token = await Token.create({ user: userId, refreshToken })
		return token;
	}

	async removeToken(refreshToken) {
		const tokenData = await Token.deleteOne({ refreshToken });
		return tokenData;
	}
	async findTokenInDB(refreshToken) {
		const tokenData = await Token.findOne({ refreshToken });
		return tokenData;
	}

	validateAccessToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
			return userData;
		} catch (error) {
			return null;
		}
	}

	validateRefreshToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
			return userData;
		} catch (error) {
			return null;
		}
	}
}

export default new TokenService();