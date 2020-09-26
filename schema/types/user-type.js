const graphql = require('graphql');
const User = require('../../models/user');
const BlogType = require('./blog-type');
const Blog = require('../../models/blog');
const { GraphQLDateTime } = require('graphql-scalars');
const BlogResultType = require('./blog-result-type');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLInt,
} = graphql;

const UserType = new GraphQLObjectType({
	name: 'User',
	fields() {
		return {
			_id: {
				type: GraphQLID,
			},
			name: {
				type: GraphQLString,
			},
			email: {
				type: GraphQLString,
			},
			updatedAt: {
				type: GraphQLDateTime,
			},
			createdAt: {
				type: GraphQLDateTime,
			},
			// following: new GraphQLList(UserType),
			following: {
				get type() {
					return new GraphQLList(UserType);
				},
				resolve(source, args, req, info) {
					//Get the following users from the current authenticated user
					const { following } = source;

					return User.find({ _id: { $in: following } });
				},
			},
			blogs: {
				type: BlogResultType,
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
					const count = await Blog.find({
						author: source._id,
					}).countDocuments();

					const data = await Blog.find({ author: source._id })
						.skip(cursor)
						.limit(limit);
					const len = data.length;

					let nextCursor = cursor + len;

					console.log(count);

					if (nextCursor >= count) nextCursor = null;

					return {
						data,
						nextCursor,
					};
				},
			},
		};
	},
});

module.exports = UserType;
