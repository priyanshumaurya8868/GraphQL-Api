const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

const mongoose = require("mongoose");

describe("Auth Controller - Login", function () {
  //before() & after will run only once

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

  //this will run for each testCase
  beforeEach(function () {});

  afterEach(function () {});

  //passing done is  complete optional but if u r passing it u hv to called
  // because via calling this u r giving signal to express that u have with ur all code execution
  // including the asyncronous code snipet,
  // here  we are passing done arg because here hv to deal with async snipet
  it("should throught error 500 if accessing db failed!", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "email@email.com",
        password: "secretpassword",
      },
    };

    //if don't use done arg here then express wont wait for below code to be execute properly,
    // and end its execution before it could exec
    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });

  it('should send a response with a valid user status for an existing user', (done) => {
    const req = { userId: '5c0f66b979af55031b34728a' };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      }
    };
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
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
