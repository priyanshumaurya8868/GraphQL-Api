const bcrypt = require("bcryptjs");
const validator = require('validator')
const User = require("../models/User");

module.exports = {
  //here always be 2 prams, args can contain more than one object which were passec
  createUser: async function (args, req) {
    const userInput = args.userInput;

    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
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

  hello : ()=>{
    return "hello World!"
  }

};

