import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './routes/blog.js';
import userRoutes from './routes/user.js';
import { rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from './logger/logger.js';
dotenv.config();
import connectDb from './utils/connectDb.js';
// Create Express app
const app = express();

app.use(cors());
app.use(express.json());

app.use(cookieParser('NotSoSecret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// // users routes
app.use('/users', userRoutes);
// // blog routes
app.use('/blogs', blogRoutes);

app.use('/', (req, res) => {
	res.send('Welcome to api');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	connectDb();
	logger.info(`Server is running on port ${PORT}`);
});

export default app;
