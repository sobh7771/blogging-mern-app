const graphql = require('graphql');
const User = require('../../models/user');
const BlogType = require('./blog-type');
const Blog = require('../../models/blog');
const { GraphQLDateTime } = require('graphql-scalars');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

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
				type: new GraphQLList(BlogType),
				resolve(source, args, req, info) {
					return Blog.find({ author: source._id });
				},
			},
		};
	},
});

module.exports = UserType;
