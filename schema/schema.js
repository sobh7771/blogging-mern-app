const graphql = require('graphql');
const RootQueryType = require('./types/root-query-type');
const mutations = require('./mutations');

const { GraphQLSchema } = graphql;

const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: mutations,
});

module.exports = schema;
