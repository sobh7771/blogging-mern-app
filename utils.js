const isLoggedIn = (req) => {
	if (req.isUnauthenticated()) {
		throw new Error('Unauthorized!');
	}

	return req.user;
};

module.exports = {
	isLoggedIn,
};
