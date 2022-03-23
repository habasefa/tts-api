const jwt = require("jsonwebtoken");

const check_role = (role) => (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    console.log(user);
    if (!err) {
      req.user = user;
      if (role.includes(user.role)) {
        console.log("worked");
        next();
      } else {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      next();
    } else {
      return res.json({ message: "User not uthenticated" });
    }
  });
};

module.exports = check_role;
