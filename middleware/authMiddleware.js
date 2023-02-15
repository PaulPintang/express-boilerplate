const jwt = require("jsonwebtoken");

const protected = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SCRT);
    req.user = verified;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protected;
