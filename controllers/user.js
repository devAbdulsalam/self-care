import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import logger from '../logger/logger.js';
import createTokens from '../utils/createTokens.js';

// User Signup endpoint
export const signup = async (req, res) => {
	try {
		const { email, password, firstName, lastName } = req.body;

		// Check if user already exists
		let existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: 'User already exists' });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const newUser = new User({
			email,
			password: hashedPassword,
			firstName,
			lastName,
		});
		await newUser.save();

		res.status(201).json({ message: 'User created successfully' });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

// User Login endpoint
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ error: 'Invalid credentials' });
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ error: 'Invalid credentials' });
		}

		// Generate JWT token
		const { accessToken, refreshToken } = await createTokens(user._id);

		const options = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		};
		res
			.status(200)
			.cookie('accessToken', accessToken, options)
			.cookie('refreshToken', refreshToken, options)
			.json({ accessToken, refreshToken });
	} catch (error) {
		console.log(error);
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

// Token Refresh endpoint (optional)
export const refreshToken = async (req, res) => {
	try {
		// Implement token refreshing logic here
		res.send('refresh token');
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

export const getUserInfo = async (req, res) => {
	try {
		const user = await User.findById({ _id: req.user._id });
		res.status(200).json(user);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};
export const deleteUser = async (req, res) => {
	try {
		const user = await User.findOneAndDelete({ email: req.body.email });
		if (!user) {
			return res.status(200).json({ message: 'user deleted' });
		}
		res.status(200).json({ message: 'user deleted successfully' });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};
export const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};
