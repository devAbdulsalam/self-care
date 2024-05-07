import Blog from '../models/Blog.js';
import logger from '../logger/logger.js';
import { getPaginatedPayload } from '../utils/getPagination.js';

// User Signup endpoint
export const createBlog = async (req, res) => {
	try {
		const { title, description, tags, body, state } = req.body;
		const userId = req.user._id;

		const newBlog = new Blog({
			title,
			description,
			author: userId,
			tags,
			body,
			state, // Initial state is draft
		});
		await newBlog.save();

		res
			.status(201)
			.json({ message: 'Blog created successfully', blog: newBlog });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

const calculateReadingTime = (content) => {
	// Assuming 200 words per minute reading speed
	const wordsPerMinute = 200;
	const words = content?.split(' ').length;
	const readingTimeMinutes = Math.ceil(words / wordsPerMinute);
	return readingTimeMinutes;
};

// Read Blog
export const getBlog = async (req, res) => {
	try {
		const blog = await Blog.findById({ _id: req.params.id }).populate(
			'author',
			'firstName lastName'
		);
		if (!blog) {
			return res.status(404).json({ error: 'Blog not found' });
		}
		// Update read count
		blog.readCount += 1;
		await blog.save();
		// Calculate reading time
		const readingTimeMinutes = calculateReadingTime(blog.body);
		// Log event
		// logger.info(`Blog ${blog._id} requested by ${req.user._id}`);
		res.json({ blog, readingTimeMinutes });
	} catch (error) {
		logger.error(`Error fetching blog: ${error}`);
		res.status(500).json({ error: 'Server error' });
	}
};

export const getUserBlogs = async (req, res) => {
	try {
		const blogs = await Blog.find({ author: req.params.id });
		res.status(200).json(blogs);
	} catch (error) {
		logger.error(`Error fetching blog: ${error}`);
		res.status(500).json({ error: 'Server error' });
	}
};
// Read Blogs
export const getBlogs = async ({ query }, res) => {
	try {
		// Pagination
		const page = parseInt(query.page) || 1;
		const limit = parseInt(query.limit) || 20;
		const skip = (page - 1) * limit;

		const { id, author, title, tags, sortBy, sortOrder } = query;

		// Combine filter conditions
		const filter = { state: 'published' };
		if (id) filter._id = id;
		if (author) filter.author = author;
		if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
		if (tags) filter.tags = { $in: tags.split(',') };

		// Sorting
		let sort = { timestamp: -1 }; // Default sorting by timestamp
		if (sortBy) {
			const sortOrderValue = sortOrder === 'desc' ? -1 : 1;
			sort = { [sortBy]: sortOrderValue };
		}

		// Execute query and count concurrently
		const [blogs, totalItems] = await Promise.all([
			Blog.find(filter)
				.populate('author', 'firstName lastName')
				.sort(sort)
				.skip(skip)
				.limit(limit),
			Blog.countDocuments(filter),
		]);

		// Optimize response
		const data = {
			data: getPaginatedPayload(blogs, page, limit, totalItems),
			message: 'Blogs fetched successfully',
			success: true,
		};

		res.status(200).json(data);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

export const updateBlog = async (req, res) => {
	try {
		const userId = req.user._id;
		const blogId = req.params.id;
		const { title, description, tags, body, state } = req.body;

		let blog = await Blog.findById(blogId);
		if (!blog) {
			return res.status(404).json({ error: 'Blog not found' });
		}

		if (blog.author.toString() !== userId.toString()) {
			return res
				.status(403)
				.json({ error: 'You are not authorized to edit this blog' });
		}

		blog.title = title;
		blog.description = description;
		blog.tags = tags;
		blog.body = body;
		blog.state = state;

		await blog.save();

		res.status(200).json({ message: 'Blog updated successfully', blog });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

// Delete Blog
export const deleteBlog = async (req, res) => {
	try {
		const userId = req.user._id;
		const blogId = req.params.id;

		let blog = await Blog.findById(blogId);
		if (!blog) {
			return res.status(404).json({ error: 'Blog not found' });
		}

		if (blog.author.toString() !== userId.toString()) {
			return res
				.status(403)
				.json({ error: 'You are not authorized to delete this blog' });
		}
		await Blog.findByIdAndDelete(blogId);

		res.status(200).json({ message: 'Blog deleted successfully' });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};
export const deleteBlogTitle = async (req, res) => {
	try {
		const blog = await Blog.findOneAndDelete({ title: req.body.title });
		if (!blog) {
			return res.status(200).json({ message: 'blog deleted' });
		}
		res.status(200).json({ message: 'blog deleted successfully' });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};
