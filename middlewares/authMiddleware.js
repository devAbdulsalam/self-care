import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../logger/logger.js';
export const authMiddleware = async (req, res, next) => {
	// verify user is authenticated
	const { authorization } = req.headers;
	const token =
		req.cookies?.accessToken ||
		authorization?.split(' ')[1] ||
		req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ error: 'Authorization token required' });
	}
	try {
		const check = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const userId = check.id || check.userId || check._id;
		const user = await User.findOne({ _id: userId }).select('-password');
		if (!user) {
			return res.status(401).json({ error: 'Invalid access token' });
		}
		req.user = user;
		next();
	} catch (error) {
		logger.error(error);
		res.status(401).json({ error: 'Request is not authorized' });
	}
};
export default authMiddleware;
