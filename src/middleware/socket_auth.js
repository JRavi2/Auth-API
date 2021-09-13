const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Socket middleware for authentication
exports = module.exports = function (io) {
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
};
