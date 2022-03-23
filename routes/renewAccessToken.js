require("dotenv").config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
let rT = require("../config/refreshTokens");
let refreshTokens = rT.refreshTokens;

const {
  createAccessToken,
  createRefreshToken,
} = require("../Utils/generateToken");

router.post("/", async (req, res, next) => {
  const refresh_token = req.body.refresh_token;
  if (!refresh_token) {
    return res.status(403).json({ message: "User not authenticated." });
  }
  if (!refreshTokens.includes(refresh_token)) {
    return res.status(403).json("Refresh token is not valid");
  }
  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refresh_token);
    const newAccessToken = createAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = createRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    refreshTokens.push(newRefreshToken);
    res
      .status(201)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  });
});

module.exports = router;
