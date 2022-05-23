const mongoose = require("mongoose");

const chequeTransSchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    chequeNumber: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: String,
      required: true,
    },
    holderBankName: {
      type: String,
      required: true,
    },
    holderName: {
      type: String,
      required: true,
    },
    chequeName: {
      type: String,
      required: true,
    },
    holderAccountNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    type: {
      type: String,
      required: true,
    },
    chequeImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const chequeTransfer = mongoose.model("chequeTransfer", chequeTransSchema);

module.exports = chequeTransfer;
