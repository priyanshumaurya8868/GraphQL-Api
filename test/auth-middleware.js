const expect = require('chai').expect
const auth_middleware = require('../middleware/is-auth')


//use describe() to organize ur test cases 
describe('Testing Auth-Middleware',()=>{

    //u can even have multiple describe() inside descibe(),i.e. nesting...

    it('should throw error if Authourization header is not present.',()=>{
        const req = {
         get :(headername)=>{
             return null
         }
        }
        expect(auth_middleware.bind(this,req,{},()=>{})).to.throw('Not authenticated.')
 
 })
 
 it('should throw error if auth header could not split into 2 parts',()=>{
     const req = {
         get :(headername)=>{
             return 'bearer'
         }
        }
          //we can just use throw() alone, when we dont know the error message 
        expect(auth_middleware.bind(this,req,{},()=>{})).to.throw()
 })
})