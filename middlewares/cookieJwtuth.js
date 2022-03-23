const jwt = require("jsonwebtoken");

const cookieTwtAuth = (req, res, next) => {
  const token = req.cookies.refreshtoken;
  try {
    const user = jwt.verify(token, process.env.SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("refreshtoken");
    next(error);
  }
};

module.exports = { cookieTwtAuth };
