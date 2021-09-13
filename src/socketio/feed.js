const Post = require("../models/post");

module.exports = function (io) {
  // Connect with client
  io.on("connection", async (socket) => {
    console.log("New connection...");

    const posts = await Post.find({});
    socket.emit("update", posts);

    // Listen for Posts Addition
    socket.on("addPost", async (body) => {
      const post = new Post({
        body,
        username: socket.user.username,
      });
      try {
        await post.save();
        io.emit("add", post);
      } catch (err) {
        console.log(err);
      }
    });

    // Listen for Post Updates
    socket.on("updatePost", async (newPost) => {
      try {
        const post = await Post.findOne({
          _id: newPost._id,
        });

        if (!post) return console.log("Not Found");

        post.body = newPost.body;

        await post.save();

        const posts = await Post.find({});

        io.emit("update", posts);
      } catch (err) {
        console.log("error", err);
      }
    });

    // Listen for Post Deletions
    socket.on("deletePost", async (deleted) => {
      try {
        const post = await Post.findOneAndDelete({
          _id: deleted._id,
        });

        if (!post) return console.log("Not Found");

        const posts = await Post.find({});

        io.emit("update", posts);
      } catch (err) {
        console.log("error", err);
      }
    });
  });
};
