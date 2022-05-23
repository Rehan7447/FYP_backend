const express = require("express");
const {
  getAccountDetails,
  findAccount,
  editAccount,
  findAccountByAccountNumber,
} = require("../controller/accountController");
const {
  createChequeTransfer,
  getChequeTransfer,
  updateChequeTransfer,
} = require("../controller/chequeTransferController");
const {
  createTransfer,
  editTransferRequest,
  getTransfer,
} = require("../controller/moneyTransferController");
const {
  createPIN,
  getPin,
  updatePin,
  getPinByTransaction,
} = require("../controller/pinController");
const router = express.Router();
const { registerUser, authorizeUser } = require("../controller/userController");
// const notes = require("../data/notes");

router.post("/", registerUser);
router.post("/login", authorizeUser);
router.get("/account", getAccountDetails);
router.post("/transferRequest", createTransfer);
router.get("/findBankAccount/:id", findAccount);
router.put("/updateAccount", editAccount);
router.put("/editMoneyTransfer/:id", editTransferRequest);
router.get("/findAccountByAccountNumber", findAccountByAccountNumber);
router.get("/getTransferHistory", getTransfer);
router.post("/chequeTransaction", createChequeTransfer);
router.post("/getChequeTransaction", getChequeTransfer);
router.put("/updateChequeTransaction/:id", updateChequeTransfer);
router.post("/createPin", createPIN);
router.post("/getPin", getPin);
router.post("/getPinByTransaction", getPinByTransaction);
router.put("/updatePin/:id", updatePin);

module.exports = router;
