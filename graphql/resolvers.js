const bcrypt = require("bcryptjs");

const User = require("../models/User");

module.exports = {
  //here always be 2 prams, args can contain more than one object which were passec
  createUser: async function (args, req) {
    const userInput = args.userInput;
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

