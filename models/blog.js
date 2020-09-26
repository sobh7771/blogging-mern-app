const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
	{
		author: { type: mongoose.Types.ObjectId, required: true },
		img: {
			type: String,
			default: 'https://via.placeholder.com/468x60?text=Blogging',
		},
		title: {
			type: String,
			require: true,
			trim: true,
		},
		body: {
			type: String,
			required: true,
			trim: true,
		},
		tags: [{ type: String, trim: true }],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Blog', BlogSchema);

/**
 * @blog {
 * 		id,
 * 		author,
 * 		img,
 * 		title,
 * 		body,
 * 		tags,
 * }
 */
