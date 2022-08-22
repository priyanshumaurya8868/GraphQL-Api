const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', function() {

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
    AuthController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      });
      
    User.findOne.restore();
  });
});
