const mongoose = require('mongoose');
const _ = require('lodash');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			validate: {
				validator: isEmail,
				message: '{VALUE} is not a valid email',
			},
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
		},
		following: [mongoose.Types.ObjectId],
	},
	{
		toJSON: { transform: (doc, ret) => _.omit(ret, 'password') },
		timestamps: true,
	}
);

UserSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		const encrypted = await bcrypt.hash(user.password, 8);
		user.password = encrypted;
	}

	next();
});

UserSchema.statics.findByCredentials = function (email, password) {
	const User = this;

	return new Promise(async (resolve, reject) => {
		const user = await User.findOne({ email });

		if (!user) {
			return reject('Invalid Credentials!');
		}

		const same = bcrypt.compare(password, user.password);

		if (!same) {
			return reject('Invalid Credentials');
		}

		// Happy path
		resolve(user);
	});
};

module.exports = mongoose.model('User', UserSchema);

/**
 * @user {
 * 		id,
 *    username,
 *    password,
 *    email,
 *    followingList,
 * }
 */
