require('dotenv').config();
require('./db/mongoose');
require('./services/passport');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const passport = require('passport');
const cookieSession = require('cookie-session');
const schema = require('./schema/schema');

const app = express();
const { PORT = 5000, COOKIE_KEY, NODE_ENV = 'development' } = process.env;

app.use(
	cookieSession({
		httpOnly: true,
		secure: NODE_ENV === 'production',
		maxAge: 24 * 60 * 60 * 1000,
		keys: [COOKIE_KEY],
		sameSite: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql: true,
	})
);

app.listen(PORT, () => console.log(`Server is up on ${PORT}`));
