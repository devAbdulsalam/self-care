import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import createTokens from '../utils/createTokens.js';
// general login
export const loginWithEmailOrPhone = async (req, res) => {
	const { identifier, password } = req.body;

	try {
		if (!identifier || !password) {
			return res.status(400).json({
				message: 'User email, phone or username are required fields.',
			});
		}
		if (!password) {
			return res.status(400).json({ message: 'Password are required fields.' });
		}
		// Determine if the input is an email, phone, or username
		let user;
		if (identifier.includes('@')) {
			// If input contains '@', assume it's an email
			user = await User.findOne({ email: identifier });
		} else if (!isNaN(identifier)) {
			// If input is numeric, assume it's a phone number
			user = await User.findOne({ phone: identifier });
		} else {
			// Otherwise, assume it's a username
			user = await User.findOne({ username: identifier });
		}

		if (!user) {
			return res.status(401).json({ message: 'Invalid username or password.' });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({ message: 'Invalid username or password.' });
		}
		const userInfo = await User.findOne({ _id: user._id }).select('-password');

		const { accessToken, refreshToken } = await createTokens(user._id);
		const newUser = await User.findOne({ _id: user._id }).select('-password');
		const options = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		};

		return res
			.status(200)
			.cookie('accessToken', accessToken, options) // set the access token in the cookie
			.cookie('refreshToken', refreshToken, options)
			.json({
				user: newUser,
				accessToken,
				refreshToken,
				statusCode: 200,
				success: true,
				message: 'Logged in successfully.',
			});
	} catch (error) {
		return res
			.status(500)
			.json({ error: error.message || 'Internal server error.' });
	}
};
