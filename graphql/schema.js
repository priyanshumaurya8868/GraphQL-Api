const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Post{
    _id : ID!
    title : String!
    content : String!
    imageUrl : String!
    creator : User!
    createdAt : String!
    updatedAt : String!
}

type User {
 _id : ID!
 name : String!
 status : String!
 password : String!
 email : String!
 post : [Post!]!
}

input UserInputData{
 name : String!
 email : String!
 password :String!
 }

type RootMutation {
createUser(userInput : UserInputData) : User!
}

type UserData{
    token : String!
    userId : String!
}

type RootQuery{
 login(email: String! password : String!) : UserData!
 }

schema {
query : RootQuery
mutation: RootMutation
}

`);
