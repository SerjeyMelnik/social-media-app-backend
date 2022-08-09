import TokenService from "../Endpoints/User/TokenService.js";
import ApiError from "../exceptions/ApiError.js";

export default function (req, res, next) {
	try {
		const authorization_header = req.headers.authorization;
		if (!authorization_header) {
			return next(ApiError.UnauthorizedError())
		}
		const accessToken = authorization_header.split(" ")[1];
		if (!accessToken) {
			return next(ApiError.UnauthorizedError())
		}

		const userData = TokenService.validateAccessToken(accessToken);
		if (!userData) {
			return next(ApiError.UnauthorizedError())
		}

		req.user = userData;
		next()
	} catch (e) {
		return next(ApiError.UnauthorizedError())
	}
}