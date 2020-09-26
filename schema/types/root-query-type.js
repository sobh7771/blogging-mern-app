const graphql = require('graphql');
const UserResultType = require('./user-result-type');
const UserType = require('./user-type');
const User = require('../../models/user');
const { isLoggedIn } = require('../../utils');
const BlogType = require('./blog-type');
const Blog = require('../../models/blog');

const { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLInt } = graphql;

const RootQueryType = new GraphQLObjectType({
	name: 'Query',
	fields: {
		viewer: {
			type: UserType,
			resolve(source, args, req, info) {
				return req.user;
			},
		},
		recommendations: {
			type: new GraphQLNonNull(new GraphQLList(UserType)),
			async resolve(source, { size = 4 }, req, info) {
				isLoggedIn(req);

				const { user } = req;

				return User.aggregate([
					{ $match: { _id: { $nin: [...user.following, user._id] } } },
					{ $sample: { size } },
				]);
			},
		},
		blogs: {
			type: new GraphQLList(BlogType),
			resolve(source, args, req, info) {
				return Blog.find();
			},
		},
		followed: {
			type: UserResultType,
			args: {
				cursor: {
					type: GraphQLInt,
					defaultValue: 0,
				},
				limit: {
					type: GraphQLInt,
					defaultValue: 3,
				},
			},
			async resolve(source, { cursor, limit }, req, info) {
				const user = isLoggedIn(req);

				// users that authenticated user follow
				const countArr = await User.aggregate([
					{
						$match: {
							_id: {
								$in: user.following,
							},
						},
					},
					{ $count: 'count' },
				]);

				const count = countArr[0].count;

				const data = await User.aggregate([
					{
						$match: {
							_id: {
								$in: user.following,
							},
						},
					},
					{ $skip: cursor },
					{ $limit: limit },
				]);

				let nextCursor = data.length + cursor;

				if (nextCursor >= count) nextCursor = null;

				return {
					data,
					nextCursor,
				};
			},
		},
	},
});

module.exports = RootQueryType;
