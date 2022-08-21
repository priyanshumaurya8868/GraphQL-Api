const expect = require("chai").expect;
const auth_middleware = require("../middleware/is-auth");
const jwt = require("jsonwebtoken");
const sinon = require('sinon')

//use describe() to organize ur test cases
describe("Testing Auth-Middleware", () => {
  //u can even have multiple describe() inside descibe(),i.e. nesting...

  it("should throw error if Authourization header is not present.", () => {
    const req = {
      get: (headername) => {
        return null;
      },
    };
    expect(auth_middleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should throw error if auth header could not split into 2 parts", () => {
    const req = {
      get: (headername) => {
        return "bearer";
      },
    };
    //we can just use throw() alone, when we dont know the error message
    expect(auth_middleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yeild userId for decoding a token", () => {
    const req = {
        get: (headername) => {
          return "bearer  jnewefkwefnwefonwjkgvngregege";
        },
      };

      sinon.stub(jwt, 'verify');
      jwt.verify.returns({userId : 'abc'})
      auth_middleware(req,{},()=>{})
      expect(req).to.have.property('userId');
      expect(req).to.have.property('userId','abc');
      expect(jwt.verify.called).to.be.true;
      jwt.verify.restore();


  });
});
