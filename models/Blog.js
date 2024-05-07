// models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: false,
	},
	description: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	state: {
		type: String,
		enum: ['draft', 'published'],
		default: 'draft',
	},
	readCount: {
		type: Number,
		default: 0,
	},
	readingTime: Number, // You'll need to calculate this
	tags: [String],
	body: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
