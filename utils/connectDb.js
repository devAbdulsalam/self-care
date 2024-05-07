import { connect, set } from 'mongoose';
const connectDb = () => {
	set('strictQuery', true);
	// MongoDB connection
	connect(process.env.MDB_URL)
		.then(() => {
			console.log('connected to database successfully');
		})
		.catch((err) => console.log(err));
};

export default connectDb;
