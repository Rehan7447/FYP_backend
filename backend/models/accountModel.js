const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    accountHolder: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    IBAN: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: "active",
    },
    balance: {
      type: String,
      required: true,
      default: "50000",
    },
  },
  {
    timestamps: true,
  }
);

const account = mongoose.model("Account", accountSchema);

module.exports = account;
