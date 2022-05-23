const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		salary: {
			type: Number,
			required: true,
		},
		designation: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

employeeSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

employeeSchema.methods.matchPassword = async function (enteredPass) {
	return await bcrypt.compare(enteredPass, this.password);
};

const employee = mongoose.model("Employee", employeeSchema);

module.exports = employee;
