const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = 'infnet'
const JWT_EXPIRESIN = 3600 //1h

exports.generateHash = async (password) => {
  const passEncode = await bcrypt.genSaltSync(10, "a");
  return bcrypt.hashSync(password, passEncode);
};

exports.generateToken = (payload) => {
  return {
    type: "bearer",
    token: jwt.sign({ ...payload }, SECRET_KEY, {
      expiresIn: parseInt(JWT_EXPIRESIN),
    }),
  };
};
