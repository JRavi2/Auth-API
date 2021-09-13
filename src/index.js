const http = require("http");
const path = require("path");

const express = require("express");
const socketio = require("socket.io");

require("./db/mongoose");
const userRouter = require("./routes/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 8000;

// Import socket functions
require("./middleware/socket_auth")(io);
require("./socketio/feed")(io);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

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
