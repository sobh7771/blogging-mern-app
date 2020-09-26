const graphql = require('graphql');
const UserType = require('./user-type');

const { GraphQLObjectType, GraphQLList, GraphQLInt } = graphql;

const UserResultType = new GraphQLObjectType({
	name: 'UserResult',
	fields: {
		data: {
			type: new GraphQLList(UserType),
		},
		nextCursor: {
			type: GraphQLInt,
		},
	},
});

module.exports = UserResultType;
