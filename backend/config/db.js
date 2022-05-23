const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const con = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		console.log(`Connected to MongoDB: ${con.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error}`);
	}
};

module.exports = connectDB;
