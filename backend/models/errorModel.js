const mongoose = require("mongoose");

const errorSchema = mongoose.Schema(
	{
		details: {
			type: String,
			required: true,
		},
		transactionID: {
			type: mongoose.Types.ObjectId,
		},
		status: {
			type: String,
			required: true,
			default: "Pending",
		},
	},
	{
		timestamps: true,
	}
);

const error = mongoose.model("Error", errorSchema);

module.exports = error;
