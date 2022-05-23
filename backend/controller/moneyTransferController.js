const asyncHandler = require("express-async-handler");
const transferM = require("../models/moneyTransferModel");
const accountM = require("../models/accountModel");

const createTransfer = asyncHandler(async (req, res) => {
  const transfer = await transferM.create(req.body);
  if (transfer) {
    res.status(201);
    res.json(transfer);
  } else {
    res.status(400);
    throw new Error("Failed to create transfer request");
  }
});

const getTransfer = asyncHandler(async (req, res) => {

  const transfer = await transferM.find({IBAN: req.body.IBAN});
  if (transfer) {
    res.status(201);
    res.json(transfer);
  } else {
    res.status(400);
    throw new Error("Failed to get transfer request");
  }
});

const editTransferRequest = asyncHandler(async (req, res) => {
  const transfer = await transferM.findByIdAndUpdate(req.params.id, req.body);
  if (transfer) {
    const updated = await transferM.findById(req.params.id);
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

module.exports = { createTransfer, editTransferRequest, getTransfer };
