import { Router } from 'express';
import {
	signup,
	login,
	getUsers,
	getUserInfo,
	deleteUser,
	refreshToken,
} from '../controllers/user.js';

// Import middleware
import authMiddleware from '../middlewares/authMiddleware.js';
import { loginWithEmailOrPhone } from '../controllers/auth.js';
const router = Router();

// //new user
router.post('/signup', signup);

// // login user
router.post('/login', login);

// // sign user in with phone or email
router.post('/signin', loginWithEmailOrPhone);
// //get user info
router.post('/me', authMiddleware, getUserInfo);

router.get('/', getUsers);
router.delete('/', deleteUser);
// get refresh token
router.post('/refresh-token', refreshToken);
export default router;
