const express = require("express");
const router = express.Router();
const adminC = require("../controller/adminController");

router.get("/", adminC.getProfile);

// Employee Routes
router.get("/employees", adminC.getAllEmployees);
router.get("/employee/:eid", adminC.getEmployeeWithId);
router.post("/addEmployee", adminC.addEmployee);
router.put("/updateEmployee/:eid", adminC.updateEmployeeWithId);
router.put("/employees/updateEmployee/:eid", adminC.updateEmployeeWithId);
router.delete("/deleteEmployee/:eid", adminC.deleteEmployeeWithId);

// Cashier Routes
router.get("/cashiers", adminC.getAllCashiers);
router.get("/cashier/:cid", adminC.getCashierWithId);
router.post("/addCashier", adminC.addCashier);
router.put("/updateCashier/:cid", adminC.updateCashierWithId);
router.delete("/deleteCashier/:cid", adminC.deleteCashierWithId);

// Customer Routes
router.get("/customers", adminC.getAllCustomers);
router.get("/customer/:uid", adminC.getCustomerWithId);
router.post("/addCustomer", adminC.addCustomer);
router.put("/updateCustomer/:uid", adminC.updateCustomerWithId);
router.delete("/deleteCustomer/:uid", adminC.deleteCustomerWithId);

// Customer With Accounts Routes
router.get("/accounts", adminC.getAllAccounts);
router.get("/account/:aid", adminC.getAccountWithId);
router.get("/customerAccount/:cid", adminC.getCustomerAccountWithCustomerId);
router.post("/addAccount/:uid", adminC.addAccount);
router.put("/updateAccount/:aid", adminC.updateAccountWithId);
router.delete("/deleteAccount/:aid", adminC.deleteAccountWithId);

// Cheque Routes
router.get("/cheques", adminC.getAllCheques);

// Report Error Routes
router.get("/errors", adminC.getAllErrors);

router.get("/chequeTransactions", adminC.getAllChequeTransactions);
module.exports = router;
