const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const fs = require("fs");
// const path = require("path");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    IBAN: {
      type: String,
      required: false,
      default:""
    },
    CNIC: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: true,
    },
    isEmployee: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPass) {
  return await bcrypt.compare(enteredPass, this.password);
};

const user = mongoose.model("User", userSchema);

module.exports = user;
