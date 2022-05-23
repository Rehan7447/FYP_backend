const asyncHandler = require("express-async-handler");
const otpGenerator = require("otp-generator");
const pinM = require("../models/otpModel");

const createPIN = asyncHandler(async (req, res) => {
  const pin = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const expDate = new Date().getTime() + 86400000;
  const transId = req.body.id;
  const create = await pinM.create({
    transactionId: transId,
    expiration: expDate,
    pin: pin,
  });
  if (create) {
    res.status(201);
    res.json(create);
  } else {
    res.status(400);
    throw new Error("Failed to create transfer request");
  }
});

const getPin = asyncHandler(async (req, res) => {
  const pin = await pinM.find({ pin: req.body.pin });
  if (pin != "") {
    res.status(201);
    const data = pin[0];
    const currDate = new Date().getTime();
    if (data.expiration < currDate) {
      const expire = await pinM.findOneAndUpdate(pin, { status: "expired" });
      if (expire) {
        res.status(400);
        throw new Error("expired");
      } else {
        res.status(400);
        throw new Error("Error resolving request");
      }
    } else if (data.status.toLowerCase() === "used".toLowerCase()) {
      res.status(400);
      throw new Error("used");
    } else if (data.status.toLowerCase() === "expired".toLowerCase()) {
      res.status(400);
      throw new Error("expired");
    } else if (data.status.toLowerCase() === "invalid".toLowerCase()) {
      res.status(400);
      throw new Error("invalid");
    } else {
      res.json(pin);
    }
  } else {
    res.status(400);
    throw new Error("Pin doesnt exist");
  }
});

const updatePin = asyncHandler(async (req, res) => {
  const pin = await pinM.findByIdAndUpdate(req.params.id, req.body);
  if (pin) {
    const updated = await pinM.findById(req.params.id);
    if (updated) {
      res.status(201);
      res.json(updated);
    } else {
      res.status(400);
      throw new Error("Pin not found");
    }
  } else {
    res.status(400);
    throw new Error("Error While Updating Pin");
  }
});

const getPinByTransaction = asyncHandler(async (req, res) => {
  const pin = await pinM.find({ transactionId: req.body.id });
  if (pin) {
    res.status(201);
    res.json(pin);
  } else {
    res.status(400);
    throw new Error("Failed to get transfer request");
  }
});

module.exports = { createPIN, getPin, updatePin, getPinByTransaction };
