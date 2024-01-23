const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert("createToken passed user");

  let payload = {
    username: user.username,
    id: user.id,
    userType: user.userType
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
