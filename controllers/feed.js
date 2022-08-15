
const { validationResult } = require("express-validator")

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/duck.jpg",
        creator: {
          name: "Maximilian",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {

  const errors = validationResult(req);
  console.log(errors)
  if(!errors.isEmpty()){
   res.status(422).json({
      message : "Failed to create Post!",
      errors : errors.array()
    })
  }

  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content,
      creator: { name: "Maimilian" },
      createdAt: new Date(),
    },
  });
};
