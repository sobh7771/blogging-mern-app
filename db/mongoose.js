const mongoose = require('mongoose');
const { MONGO_URI = 'mongodb://127.0.0.1:27017/blogging' } = process.env;

mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useFindAndModify: true,
		useUnifiedTopology: true,
	})
	.then(
		() => {
			console.log('Connected!');
		},
		() => {
			console.log('Unable to connect!');
		}
	);
