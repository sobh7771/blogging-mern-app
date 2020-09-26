const graphql = require('graphql');
const UserType = require('./types/user-type');
const User = require('../models/user');
const BlogType = require('../schema/types/blog-type');
const { isLoggedIn } = require('../utils');
const Blog = require('../models/blog');
const _ = require('lodash');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull,
	GraphQLID,
	GraphQLList,
} = graphql;

const mutations = new GraphQLObjectType({
	name: 'Mutations',
	fields: {
		signup: {
			type: new GraphQLNonNull(UserType),
			args: {
				name: {
					type: new GraphQLNonNull(GraphQLString),
				},
				email: {
					type: new GraphQLNonNull(GraphQLString),
				},
				password: {
					type: new GraphQLNonNull(GraphQLString),
				},
			},
			async resolve(source, { name, email, password }, req, info) {
				return new Promise(async (resolve, reject) => {
					try {
						const user = await User.create({ name, email, password });
						req.logIn(user, (err) => {
							if (err) reject(err);

							resolve(user);
						});
					} catch (err) {
						reject(err);
					}
				});
			},
		},
		login: {
			type: new GraphQLNonNull(UserType),
			args: {
				email: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) },
			},
			async resolve(source, { email, password }, req, info) {
				const user = await User.findByCredentials(email, password);

				return new Promise((resolve, reject) => {
					req.logIn(user, (err) => {
						if (err) {
							return reject();
						}

						resolve(user);
					});
				});
			},
		},
		logout: {
			type: UserType,
			resolve(source, args, req, info) {
				const { user } = req;
				req.logOut();

				return user;
			},
		},
		follow: {
			type: new GraphQLNonNull(UserType),
			args: {
				userId: {
					type: new GraphQLNonNull(GraphQLID),
				},
			},
			async resolve(source, { userId }, req, info) {
				const { following } = isLoggedIn(req);

				if (!following.includes(userId)) {
					following.push(userId);
				}

				return await req.user.save();
			},
		},
		addBlog: {
			type: BlogType,
			args: {
				title: { type: new GraphQLNonNull(GraphQLString) },
				body: { type: new GraphQLNonNull(GraphQLString) },
				tags: { type: new GraphQLList(GraphQLString) },
			},
			resolve(source, { title, body, tags }, req, info) {
				isLoggedIn(req);

				return new Promise(async (resolve, reject) => {
					try {
						const blog = await Blog.create({
							author: req.user.id,
							title,
							body,
							tags,
						});

						resolve(blog);
					} catch (err) {
						reject(err);
					}
				});
			},
		},
		editBlog: {
			type: BlogType,
			args: {
				blogId: {
					type: GraphQLID,
				},
				title: {
					type: GraphQLString,
				},
				body: {
					type: GraphQLString,
				},
				tags: {
					type: new GraphQLList(GraphQLString),
				},
			},
			resolve(source, { blogId, ...args }, req, info) {
				const blog = _.pick(args, ['title', 'body', 'tags']);

				const user = isLoggedIn(req);

				return Blog.findOneAndUpdate(
					{ _id: blogId, author: user._id },
					{ $set: blog },
					{ new: true }
				);
			},
		},
		deleteBlog: {
			type: BlogType,
			args: {
				blogId: {
					type: GraphQLID,
				},
			},
			resolve(source, { blogId }, req, info) {
				const user = isLoggedIn(req);

				return Blog.findOneAndDelete({ _id: blogId, author: user._id });
			},
		},
	},
});

module.exports = mutations;
