const graphql = require('graphql');
const User = require('../../models/user');
const { GraphQLDateTime } = require('graphql-scalars');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const BlogType = new GraphQLObjectType({
	name: 'Blog',
	fields() {
		return {
			_id: {
				type: GraphQLID,
			},
			author: {
				type: require('./user-type'),
				resolve(source, args, req, info) {
					return User.findById(source.author);
				},
			},
			title: {
				type: GraphQLString,
			},
			body: {
				type: GraphQLString,
			},
			updatedAt: {
				type: GraphQLDateTime,
			},
			createdAt: {
				type: GraphQLDateTime,
			},
			tags: {
				type: new GraphQLList(GraphQLString),
			},
		};
	},
});

module.exports = BlogType;
