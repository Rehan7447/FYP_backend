const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    expiration: {
      type: "String",
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const otp = mongoose.model("OTP", otpSchema);

module.exports = otp;
