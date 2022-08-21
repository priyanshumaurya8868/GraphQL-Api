
var expect = require('chai').expect

it('sum of two is 5',()=>{
    const num1 = 3
    const num2 = 2

    expect(num1+num2).to.equal(5)
})


it('sum of 2 is not 6',()=>{
    const num1 = 3
    const num2 = 2

    expect(num1+num2).not.to.equal(6)
})