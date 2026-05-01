const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },

  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },

  age: Number,
  data: String,
  experience: String,

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  email: {
    type: String,
    required: true,
    unique: true,
  },

  profilePicture: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);