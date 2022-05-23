const asyncHandler = require("express-async-handler");
const chequeM = require("../models/chequeTransModel");
const OCR = require("../utils/OCR");

const createChequeTransfer = asyncHandler(async (req, res) => {
  const data = await OCR(req.body.pic);
  const arr = data.split("\n");
  console.log(arr);
  const numberReg = /\d+/g;
  var chequeNumber = "";
  var date = "";
  var bank = "";
  var reciever = "";
  var amount = "";
  var account = "";
  var holder = "";
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf("Cheque No") > -1) {
      chequeNumber = arr[i].replace(/\s/g, "").match(numberReg);
      console.log("Cheque Number: " + chequeNumber);
    }
    if (arr[i].indexOf("Date") > -1) {
      date = arr[i].replace(/\s/g, "").match(numberReg);
      date =
        date[0][0] +
        date[0][1] +
        "-" +
        date[0][2] +
        date[0][3] +
        "-" +
        date[0][4] +
        date[0][5] +
        date[0][6] +
        date[0][7];
      console.log("date :" + date);
    }
    if (
      arr[i].indexOf("ABL") > -1 ||
      arr[i].indexOf("HBL") > -1 ||
      arr[i].indexOf("NBP") > -1
    ) {
      if (!bank || bank != "") {
        if (!(arr[i].indexOf("NBPA") > -1)) {
          bank = arr[i].match(/^[A-Z]{3}/);
        }
        console.log("Bank: " + bank);
      }
    }
    if (arr[i].indexOf("Pay") > -1) {
      reciever = arr[i].match(/(?<=Pay)(.*)(?=or bearer)/);
      if (!reciever) {
        console.log("Pay: " + reciever);
        reciever = arr[i].match(/(?<=Pay)(.*)/);
      }
      console.log("Pay: " + reciever);
    }
    if (arr[i].indexOf("PKR") > -1) {
      var temp = arr[i].replace(/[^a-zA-Z0-9 ]/g, "");
      amount = temp.match(numberReg);
      if (!amount) {
        temp = arr[i - 1].replace(/[^a-zA-Z0-9 ]/g, "");
        amount = temp.match(numberReg);
      }
      console.log("amount is: " + amount);
    }
    if (arr[i].match(/\bPK.*\b/)) {
      account = arr[i]
        .replace(/\s*/g, "")
        .match(/^[PK]{2}[0-9]{2}[A-Z]{4}[0-9]{16}/);
      console.log("account is: " + account);
    }
    if (i == arr.length - 3) {
      holder = arr[i].match(/^\s*(\w+ \w+)/);
      console.log("Holder: " + holder);
    }
  }
  if (chequeNumber) {
    chequeNumber = chequeNumber[0];
  } else {
    chequeNumber = "Not Found";
  }
  if (bank) {
    bank = bank[0];
  } else {
    bank = "Not Found";
  }
  if (reciever) {
    reciever = reciever[0].trim();
  } else {
    reciever = "Not Found";
  }
  if (amount) {
    amount = amount[0];
  } else {
    amount = "Not Found";
  }
  if (account) {
    account = account[0];
  } else {
    account = "Not Found";
  }
  if (holder) {
    holder = holder[0];
  } else {
    holder = "Not Found";
  }

  const transfer = await chequeM.create({
    chequeNumber: chequeNumber,
    amount: amount,
    holderBankName: bank,
    holderAccountNumber: account,
    chequeImage: req.body.pic,
    type: req.body.type,
    holderName: holder,
    chequeName: reciever,
    date: date,
  });
  if (transfer) {
    res.status(201);
    res.json(transfer);
  } else {
    res.status(400);
    throw new Error("Failed to create transfer request");
  }
});

const getChequeTransfer = asyncHandler(async (req, res) => {
  var query = {};
  if (req.body.id) {
    query = { _id: req.body.id };
  } else {
    query = { holderAccountNumber: req.body.iban };
  }
  const transfer = await chequeM.find(query);
  if (transfer) {
    res.status(201);
    res.json(transfer);
  } else {
    res.status(400);
    throw new Error("Cheque Transfer Doesnt exist");
  }
});

const updateChequeTransfer = asyncHandler(async (req, res) => {
  const transfer = await chequeM.findByIdAndUpdate(req.params.id, req.body);
  if (transfer) {
    const updated = await chequeM.findById(req.params.id);
    if (updated) {
      res.status(201);
      res.json(updated);
    } else {
      res.status(400);
      throw new Error("Transfer Request not found");
    }
  } else {
    res.status(400);
    throw new Error("Error While Updating Transfer Request");
  }
});

const deleteChequeTransaction = asyncHandler(async (req, res, next) => {
  const exists = await chequeM.findById({ _id: req.params.id });
  if (exists == null) {
    res.status(400);
    throw new Error("Cheque data not found.");
  }
  chequeM
    .deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log("Cheque Data deleted successfully.");
      res.json(result);
    })
    .catch((err) => {
      console.log("Error while deleting data.");
      throw new Error("Cheque data not found.");
    });
});

module.exports = {
  createChequeTransfer,
  getChequeTransfer,
  updateChequeTransfer,
  deleteChequeTransaction,
};
