const expect = require('chai').expect
const auth_middleware = require('../middleware/is-auth')

it('should throw error if Authourization header is not present.',()=>{
       const req = {
        get :(headername)=>{
            return null
        }
       }

       expect(auth_middleware.bind(this,req,{},()=>{})).to.throw('Not authenticated.')

})