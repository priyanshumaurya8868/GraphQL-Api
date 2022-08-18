const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
module.exports = {
  //here always be 2 prams, args can contain more than one object which were passec
  createUser: async function (args, req) {
    const userInput = args.userInput;

    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      throw new Error("User exists already!");
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      name: userInput.name,
      email: userInput.email,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc };
    //_doc to remove metadata added by  mongoose
  },

  // login: async function( email, password )  -> cant write like this as  they both comes in object called args
  login: async function({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      process.env.jwt_secret_key,
      { expiresIn: '1h' }
    );
    return { token: token, userId: user._id.toString() };
  }
};
