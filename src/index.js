const express = require("express");
require("./db/mongoose");
const userRouter = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8000;

// Automatically parse the incoming JSON
app.use(express.json());

// Configure the Routes
app.use(userRouter);

// Endpoint to test if the server is responding
app.get("/", (req, res) => {
  res.send("Ping");
});

// Start Listening on PORT
app.listen(PORT, () => {
  console.log("Server is Running on port", PORT);
});
