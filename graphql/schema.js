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

input PostInputData{
    title : String!
    imageUrl : String!
    content : String!
}

type RootMutation {
createUser(userInput : UserInputData) : User!
createPost(postInput : PostInputData) : Post!
}

type UserData{
    token : String!
    userId : String!
}
type PostData {
    posts: [Post!]!
    totalPosts: Int!
}

type RootQuery{
 login(email: String! password : String!) : UserData!
 posts(page: Int): PostData! 
 }

schema {
query : RootQuery
mutation: RootMutation
}

`);
