const graphql = require('graphql');
const BlogType = require('./blog-type');

const { GraphQLObjectType, GraphQLList, GraphQLInt } = graphql;

const BlogResultType = new GraphQLObjectType({
	name: 'BlogResult',
	fields: {
		data: {
			type: new GraphQLList(BlogType),
		},
		nextCursor: {
			type: GraphQLInt,
		},
	},
});

module.exports = BlogResultType;
