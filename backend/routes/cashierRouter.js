const express = require("express");
const router = express.Router();
const cashierC = require("../controller/cashierController");

router.get("/", cashierC.getProfile);

// Employee Routes
router.get("/employees", cashierC.getAllEmployees);
router.get("/employee/:eid", cashierC.getEmployeeWithId);
router.post("/addEmployee", cashierC.addEmployee);
router.put("/updateEmployee/:eid", cashierC.updateEmployeeWithId);
router.put("/employees/updateEmployee/:eid", cashierC.updateEmployeeWithId);
router.delete("/deleteEmployee/:eid", cashierC.deleteEmployeeWithId);

// Cashier Routes
router.get("/cashiers", cashierC.getAllCashiers);
router.get("/cashier/:cid", cashierC.getCashierWithId);
router.post("/addCashier", cashierC.addCashier);
router.put("/updateCashier/:cid", cashierC.updateCashierWithId);
router.delete("/deleteCashier/:cid", cashierC.deleteCashierWithId);

// Customer Routes
router.get("/customers", cashierC.getAllCustomers);
router.get("/customer/:uid", cashierC.getCustomerWithId);
router.post("/addCustomer", cashierC.addCustomer);
router.put("/updateCustomer/:uid", cashierC.updateCustomerWithId);
router.delete("/deleteCustomer/:uid", cashierC.deleteCustomerWithId);

// Customer With Accounts Routes
router.get("/accounts", cashierC.getAllAccounts);
router.get("/account/:aid", cashierC.getAccountWithId);
router.post("/addAccount/:uid", cashierC.addAccount);
router.put("/updateAccount/:aid", cashierC.updateAccountWithId);
router.delete("/deleteAccount/:aid", cashierC.deleteAccountWithId);

// Cheque Routes
router.get("/cheques", cashierC.getAllCheques);

// Report Error Routes
router.get("/errors", cashierC.getAllErrors);
module.exports = router;
