const mongoose = require("mongoose");
const { hashSync, compareSync } = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.pre("save", function (next) {
  this.password = hashSync(this.password);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
