const http = require("http");
const path = require("path");

const express = require("express");
const jwt = require("jsonwebtoken");
const socketio = require("socket.io");

require("./db/mongoose");
const userRouter = require("./routes/user");
const User = require("./models/user");
const Post = require("./models/post");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 8000;

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Socket middleware for authentication
io.use(async (socket, next) => {
  const token = socket.handshake.query.token;
  const decoded = jwt.verify(token, "thisisjwt");
  const user = await User.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });

  if (!user) next(new Error());
  socket.user = user;

  next();
});

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

// Automatically parse the incoming JSON
app.use(express.json());

// Configure the Routes
app.use(userRouter);

// Endpoint to test if the server is responding
app.get("/", (req, res) => {
  res.send("Ping");
});

// Start Listening on PORT
server.listen(PORT, () => {
  console.log("Server is Running on port", PORT);
});
