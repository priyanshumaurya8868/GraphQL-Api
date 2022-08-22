const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller", () => {
  before(function (done) {
    mongoose
      .connect("mongodb://localhost:27017/test")
      .then((result) => {
        const user = new User({
          email: "email@email.com",
          password: "123456",
          name: "Test",
          post: [],
          _id: "5c0f66b979af55031b34728a",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });


//inorder to run below test case it is mandatory to comment socket.io wala part
  it('should add a created post to the posts of the creator', function(done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post'
      },
      file: {
        path: 'abc'
      },
      userId: '5c0f66b979af55031b34728a'
    };
    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    FeedController.createPost(req, res, () => {}).then(savedUser => {
        console.log(savedUser)
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

  after((done) => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
