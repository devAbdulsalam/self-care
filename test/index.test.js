import supertest from 'supertest';
import app from '../index.js';
const userId = '6638ce94fe476aaa72901e4f';
import { createToken } from '../utils/jwtokens.js';
const token = createToken(userId);
// // change email value as it is unique
const userToAdd = {
	firstName: 'john',
	lastName: 'doe',
	phone: '090123456789',
	email: 'johndoe190@gmail.com',
	password: '123456',
};
const blogToAdd = {
	title: 'blog24',
	author: userId,
	description: 'blog test',
	state: 'draft',
	tags: ['draft', 'blog'],
	body: 'test blog',
};
//change blog title for is unique
const uniqueCode = new Date();
console.log('unique code ajkgjklklfkljklfkllkj', uniqueCode);
const blogToUpdate = {
	title: `Update test blog ${uniqueCode}`,
	author: userId,
	description: 'blog test update',
	state: 'published',
	tags: ['updated', 'blog'],
	body: 'update test blog',
};
let blogId;
describe('User Routes', () => {
	// test('GET /test  It should return the test', () => {
	// 	expect(true).toBe(true);
	// });
	test('GET /users  It should return the users', async () => {
		const response = await supertest(app).get('/users');
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8'
		);
		expect(response.statusCode).toBe(200);
	}, 10000000);
	//check if email and password match delete user or it can be registered in signup
	test('DELETE /users  It should delete user', async () => {
		const response = await supertest(app).delete('/users').send(userToAdd);
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8'
		);
		expect(response.statusCode).toBe(200);
	}, 100000000);
	test('POST /users check if signup works', async () => {
		const response = await supertest(app).post('/users/signup').send(userToAdd);
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8'
		);
		expect(response.status).toBe(201);
	}, 100000000);
	test('POST /users check if login works', async () => {
		const response = await supertest(app).post('/users/login').send(userToAdd);
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8'
		);
		expect(response.status).toBe(200);
	}, 100000000);
});
describe('Blog Routes', () => {
	test('GET /blogs  It should return the blogs', async () => {
		const response = await supertest(app).get('/blogs');
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8'
		);
		expect(response.statusCode).toBe(200);
	}, 100000000);
	//check if title delete blog so it can be add as title is unique
	test('DELETE /blogs  It should delete blog', async () => {
		const response = await supertest(app)
			.delete('/blogs/title')
			.send(blogToAdd);
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8'
		);
		expect(response.statusCode).toBe(200);
	}, 100000000);
	it('POST /blogs works', async () => {
		const response = await supertest(app)
			.post('/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(blogToAdd);
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8'
		);
		expect(response.status).toBe(201);
		blogId = response.body.blog._id;
		// //'GET /blogs/:id  It should return the blog with author information and reading time',
		const response2 = await supertest(app).get(`/blogs/${blogId}`);
		expect(response2.statusCode).toBe(200);
	}, 10000000);
	it('PATCH /blogs check if update blogs works', async () => {
		console.log('blogid *****************', blogId);
		const response = await supertest(app)
			.patch(`/blogs/${blogId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(blogToUpdate);
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8'
		);
		expect(response.status).toBe(200);
	}, 10000000);
});
