const { kMaxLength } = require("buffer");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, minlength: 3, maxLength: 30 },
    email: {
      type: String,
      require: true,
      minlength: 3,
      maxLength: 200,
      unique: true,
    },
    password: { type: String, require: true, minlength: 3, maxLength: 1024 },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
