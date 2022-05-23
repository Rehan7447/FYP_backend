const userM = require("../models/userModel");
const employeeM = require("../models/employeeModel");
const asyncHandler = require("express-async-handler");
const accountM = require("../models/accountModel");
const errorM = require("../models/errorModel");
const chequeM = require("../models/chequeTransModel");
const chequeTransferM = require("../models/chequeTransModel");
// const generateToken = require("../utils/generateToken");

// Get Admin Profile
const getProfile = asyncHandler(async (req, res, next) => {
	employeeM
		.findOne({ isAdmin: true })
		.populate("user")
		.then((result) => {
			res.status(200);
			res.send(result);
			res.json(result);
		})
		.catch((err) => next(err));
});

// Employee Controllers
const getAllEmployees = asyncHandler(async (req, res, next) => {
	employeeM
		.find({ isEmployee: true })
		.populate("user")
		.then((result) => {
			res.status(200);
			return res.json(result);
		})
		.catch((err) => next(err));
});

const getEmployeeWithId = asyncHandler(async (req, res, next) => {
	employeeM
		.findById({ _id: req.params.eid })
		.populate("user")
		.then((result) => {
			res.status(200);
			return res.json(result);
		})
		.catch((err) => next(err));
});

const addEmployee = asyncHandler(async (req, res, next) => {
	const {
		name,
		email,
		phoneNumber,
		address,
		password,
		CNIC,
		dob,
		pic,
		salary,
		designation,
		role,
	} = req.body;
	const userExists = await userM.findOne({ email });
	if (userExists) {
		console.log("user already exist");
		res.status(400);
		throw new Error("User with this email already exists.");
	}
	console.log("user not exist");
	const user = await userM.create({
		name,
		email,
		phoneNumber,
		address,
		password,
		CNIC,
		dob,
		pic,
		isEmployee: true,
	});
	console.log(user);
	const employee = await employeeM.create({
		user: user._id,
		salary,
		designation,
		role,
	});
	// console.log(employee);
	
	if (employee) {
		console.log("employee created");
		res.status(201);
		return res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			phoneNumber: user.phoneNumber,
			address: user.address,
			CNIC: user.CNIC,
			pic: user.pic,
			salary: employee.salary,
			designation: employee.designation,
			role: employee.role,
		});
	} else {
		res.status(400);
		throw new Error("Error while creating Employee!");
	}
});

const updateEmployeeWithId = asyncHandler(async (req, res, next) => {
	var userId;

	await employeeM
		.findById({ _id: req.params.eid })
		.then((employee) => {
			userId = employee.user;
		})
		.catch(console.log("Employee has no user"));

	await userM
		.findOneAndUpdate(
			{ _id: userId },
			{
				$set: {
					name: req.body.name,
					phoneNumber: req.body.phoneNumber,
					pic: req.body.pic,
					email: req.body.email,
					address: req.body.address,
					CNIC: req.body.CNIC,
					dob: req.body.dob,
				},
			},
			{ new: true, upsert: false }
		)
		.then(console.log("User Object of employee updated"))
		.catch((error) => {
			console.log("Error in user updation " + error);
			res.status(500);
			res.send(error);
			return next(error);
		});

	await employeeM
		.findOneAndUpdate(
			{ _id: req.params.eid },
			{
				$set: {
					designation: req.body.designation,
					role: req.body.role,
					salary: req.body.salary,
				},
			},
			{ new: true, upsert: false }
		)
		.then((response) => {
			console.log("Employee updated");
			res.status(200);
			return res.json(response);
		})
		.catch((error) => {
			console.log("Error in employee updation " + error);
			res.status(500);
			res.send(error);
			return next(error);
		});
});

const deleteEmployeeWithId = asyncHandler(async (req, res, next) => {
	var userId;

	await employeeM
		.findById({ _id: req.params.eid })
		.then((employee) => {
			userId = employee.user;
		})
		.catch(console.log("Employee has no user"));

	await userM
		.deleteOne({ _id: userId })
		.then(console.log("User Object of employee deleted"))
		.catch((error) => {
			console.log("Error in user deletion " + error);
			res.status(500);
			res.send(error);
			return next(error);
		});

	await employeeM
		.deleteOne({ _id: req.params.eid })
		.then((result) => {
			console.log("Employee deleted");
			return res.json(result);
		})
		.catch((error) => {
			console.log("Error in employee deletion " + error);
			res.status(500);
			res.send(error);
			return next(error);
		});
});

// Cashier Controllers
const getAllCashiers = asyncHandler(async (req, res, next) => {
	employeeM
		.find({ isAdmin: false, role: "cashier" })
		.populate("user")
		.then((user) => {
			res.status(200);
			return res.json(user);
		})
		.catch((err) => next(err));
});

const getCashierWithId = asyncHandler(async (req, res, next) => {
	employeeM
		.findById({ _id: req.params.cid })
		.populate("user")
		.then((result) => {
			res.status(200);
			return res.json(result);
		})
		.catch((err) => next(err));
});

const addCashier = asyncHandler(async (req, res, next) => {
	console.log(req.body);
	const {
		name,
		email,
		phoneNumber,
		address,
		password,
		CNIC,
		dob,
		pic,
		salary,
		designation,
	} = req.body;

	const userExists = await userM.findOne({ email });
	if (userExists) {
		console.log("User Exists already");
		res.status(400);
		throw new Error("User with this email already exists.");
	}
	console.log("User does not already exist");
	const user = await userM.create({
		name,
		email,
		phoneNumber,
		address,
		password,
		CNIC,
		dob,
		pic,
		isEmployee: true,
	});
	const employee = await employeeM.create({
		user: user._id,
		salary,
		designation,
		role: "cashier",
	});

	if (employee) {
		res.status(201);
		return res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			phoneNumber: user.phoneNumber,
			address: user.address,
			CNIC: user.CNIC,
			pic: user.pic,
			salary: employee.salary,
			designation: employee.designation,
			role: employee.role,
		});
	} else {
		res.status(400);
		throw new Error("Error while creating Cashier!");
	}
});

const updateCashierWithId = asyncHandler(async (req, res, next) => {
	const cashierExist = await employeeM.findById({ _id: req.params.cid });
	if (cashierExist == null) {
		res.status(400);
		var err = new Error("Cashier does not exist.");
		throw new Error(err);
	}
	var userId;

	await employeeM
		.findById({ _id: req.params.cid })
		.then((employee) => {
			userId = employee.user;
		})
		.catch(console.log("Cashier has no user"));

	await userM
		.findOneAndUpdate(
			{ _id: userId },
			{
				$set: {
					name: req.body.name,
					phoneNumber: req.body.phoneNumber,
					pic: req.body.pic,
				},
			},
			{ new: true, upsert: false }
		)
		.then(console.log("User Object of cashier updated"))
		.catch((error) => {
			console.log("Error in user updation " + error);
			res.status(500);
			res.send(error);
			throw new Error(error);
		});

	await employeeM
		.findOneAndUpdate(
			{ _id: req.params.cid },
			{
				$set: {
					designation: req.body.designation,
					salary: req.body.salary,
				},
			},
			{ new: true, upsert: false }
		)
		.then((response) => {
			console.log("Cashier updated");
			res.status(200);
			return res.json(response);
		})
		.catch((error) => {
			console.log("Error in cashier updation " + error);
			res.status(500);
			res.send(error);
			throw new Error(error);
		});
});

const deleteCashierWithId = asyncHandler(async (req, res, next) => {
	const cashierExist = await employeeM.findById({ _id: req.params.cid });
	if (cashierExist == null) {
		res.status(400);
		var err = new Error("Cashier does not exist.");
		return next(err);
	}
	var userId;

	await employeeM
		.findById({ _id: req.params.cid })
		.then((employee) => {
			userId = employee.user;
		})
		.catch(console.log("Cashier has no user"));

	await userM
		.deleteOne({ _id: userId })
		.then(console.log("User Object of cashier deleted"))
		.catch((error) => {
			console.log("Error in user deletion " + error);
			res.status(500);
			res.send(error);
			return next(error);
		});

	await employeeM
		.deleteOne({ _id: req.params.cid })
		.then((result) => {
			console.log("Cashier deleted");
			return res.json(result);
		})
		.catch((error) => {
			console.log("Error in cashier deletion " + error);
			res.status(500);
			res.send(error);
			return next(error);
		});
});

// Customer Controllers
const getAllCustomers = asyncHandler(async (req, res, next) => {
	userM
		.find({ isEmployee: false })
		.then((user) => {
			res.status(200);
			return res.json(user);
		})
		.catch((err) => next(err));
});

const getCustomerWithId = asyncHandler(async (req, res, next) => {
	userM
		.findById({ _id: req.params.uid })
		.then((result) => {
			res.status(200);
			return res.json(result);
		})
		.catch((err) => next(err));
});

const addCustomer = asyncHandler(async (req, res, next) => {
	const { pic, name, email, phoneNumber, address, CNIC, dob, password } =
		req.body;
	const userExists = await userM.findOne({ email });
	if (userExists) {
		res.status(400);
		var err = new Error("Customer already exist.");
		next(err);
	}
	const user = await userM.create({
		name,
		email,
		phoneNumber,
		address,
		password,
		CNIC,
		dob,
		pic,
	});

	if (user) {
		res.status(201);
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			address: user.address,
			phoneNumber: user.phoneNumber,
			CNIC: user.CNIC,
			pic: user.pic,
		});
	} else {
		res.status(400);
		throw new Error("Error while creating user!");
	}
});

const updateCustomerWithId = asyncHandler(async (req, res, next) => {
	const customerExist = await userM.findById({ _id: req.params.uid });
	if (customerExist == null) {
		res.status(400);
		var err = new Error("Customer does not exist.");
		return next(err);
	}
	userM
		.findOneAndUpdate(
			{ _id: req.params.uid },
			{
				$set: {
					name: req.body.name,
					email: req.body.email,
					phoneNumber: req.body.phoneNumber,
					address: req.body.address,
					CNIC: req.body.CNIC,
					dob: req.body.dob,
					pic: req.body.pic,
				},
			},
			{ new: true, upsert: false }
		)
		.exec(function (error, results) {
			if (error) {
				console.log(error);
				res.status(500);
				res.send(error);
				return next(error);
			}
			res.status(200);
			return res.json(results);
		});
});

const deleteCustomerWithId = asyncHandler(async (req, res, next) => {
	const customerExist = await userM.findById({ _id: req.params.uid });
	if (customerExist == null) {
		res.status(400);
		var err = new Error("Customer does not exist.");
		return next(err);
	}
	userM
		.deleteOne({ _id: req.params.uid })
		.then((result) => {
			console.log("Customer deleted successfully.");
			return res.json(result);
		})
		.catch((err) => {
			console.log("Error while deleting the user.");
			next(err);
		});
});

// Account Controllers
const getAllAccounts = asyncHandler(async (req, res, next) => {
	accountM
		.find()
		.populate("accountHolder")
		.then((results) => {
			res.status(200);
			res.send(results);
			res.json(results);
		})
		.catch((err) => next(err));
});

const getCustomerAccountWithCustomerId = asyncHandler(
	async (req, res, next) => {
		accountM
			.find({ accountHolder: req.params.cid })
			.then((result) => {
				res.status(200);
				return res.json(result);
			})
			.catch((err) => next(err));
	}
);

const getAccountWithId = asyncHandler(async (req, res, next) => {
	accountM
		.findById({ _id: req.params.aid })
		.then((result) => {
			res.status(200);
			return res.json(result);
		})
		.catch((err) => next(err));
});

const addAccount = asyncHandler(async (req, res, next) => {
	const { accountNumber, bankName, bankCode, branchCode } = req.body;
	const accountHolder = req.params.uid;
	const userExists = await userM.findOne({ accountHolder });
	const accountExists = await accountM.findOne({ accountNumber });
	if (accountExists) {
		console.log("Account error");
		res.status(400);
		var err = new Error("This account is already in use.");
		next(err);
	}
	if (!userExists) {
		console.log("User error");
		res.status(400);
		var err = new Error("User does not exist.");
		next(err);
	}
	console.log("Account Holder is: " + accountHolder);
	const account = await accountM.create({
		accountHolder: accountHolder,
		accountNumber,
		bankName,
		bankCode,
		branchCode,
	});

	if (account) {
		res.status(201);
		res.json({
			account_Holder_id: account.accountHolder,
			account_Holder_name: userExists.name,
			account_Holder_CNIC: userExists.CNIC,
			accountNumber: account.accountNumber,
			bankName: account.bankName,
			bankCode: account.bankCode,
			branchCode: account.branchCode,
		});
	} else {
		res.status(400);
		throw new Error("Error while creating account!");
	}
});

const updateAccountWithId = asyncHandler(async (req, res, next) => {
	const accountExist = await accountM.findById({ _id: req.params.aid });
	if (accountExist == null) {
		res.status(400);
		var err = new Error("Account does not exist.");
		return next(err);
	}
	accountM
		.findOneAndUpdate(
			{ _id: req.params.aid },
			{
				$set: {
					accountStatus: req.body.accountStatus,
					balance: req.body.balance,
				},
			},
			{ new: true, upsert: false }
		)
		.exec(function (error, results) {
			if (error) {
				console.log(error);
				res.status(500);
				res.send(error);
				return next(error);
			}
			res.status(200);
			res.json(results);
		});
});

const deleteAccountWithId = asyncHandler(async (req, res, next) => {
	const accountExist = await accountM.findById({ _id: req.params.aid });
	if (accountExist == null) {
		res.status(400);
		throw new Error("Account does not exist.");
	}
	var customerId;

	await accountM.findById({ _id: req.params.aid })
		.then((account) => {
			customerId = account.accountHolder;
		})
		.catch(() => {
			res.status(400);
			throw new Error("Account has no holder");
		});

	await userM
		.deleteOne({ _id: customerId })
		.then(console.log("Account Holder deleted"))
		.catch((error) => {
			console.log("Error in account holder deletion " + error);
			res.status(500);
			res.send(error);
			throw new Error(error);
		});

	await accountM.deleteOne({ _id: req.params.aid })
		.then((result) => {
			console.log("AccountM deleted");
			return res.json(result);
		})
		.catch((error) => {
			console.log("Error in AccountM deletion " + error);
			res.status(500);
			res.send(error);
			return next(error);
		});
});

// Cheque Controllers
const getAllCheques = asyncHandler(async (req, res, next) => {
	chequeTransferM
		.find()
		.then((results) => {
			res.status(200);
			return res.json(results);
		})
		.catch((err) => next(err));
});

// Cheque Controllers
const getAllErrors = asyncHandler(async (req, res, next) => {
	errorM
		.find()
		.then((results) => {
			res.status(200);
			return res.json(results);
		})
		.catch((err) => next(err));
});

const getAllChequeTransactions = asyncHandler(async (req, res, next) => {
	const transfer = await chequeM.find();
	if (transfer) {
		res.status(201);
		res.json(transfer);
	} else {
		res.status(400);
		throw new Error("Cheque Transfer Doesnt exist");
	}
});

// Export All Controllers
module.exports = {
	getProfile,

	getAllEmployees,
	getEmployeeWithId,
	addEmployee,
	updateEmployeeWithId,
	deleteEmployeeWithId,

	getAllCashiers,
	getCashierWithId,
	addCashier,
	updateCashierWithId,
	deleteCashierWithId,

	getAllCustomers,
	getCustomerWithId,
	addCustomer,
	updateCustomerWithId,
	deleteCustomerWithId,

	getAllAccounts,
	getAccountWithId,
	getCustomerAccountWithCustomerId,
	addAccount,
	updateAccountWithId,
	deleteAccountWithId,

	getAllCheques,

	getAllErrors,

	getAllChequeTransactions,
};
