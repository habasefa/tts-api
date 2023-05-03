const bcrypt = require("bcrypt");
const validator = require("validator");
const log = require("../lib/chalkLog");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createAccessToken, createRefreshToken } = require("./generateToken");
let rT = require("../config/refreshTokens");
let refreshTokens = rT.refreshTokens;

const userRegister = async (req, res, next) => {
  try {
    log.flag("signing up...");
    const { email, password, role } = req.body;

    if (
      !(
        validator.isEmail(email) &&
        validator.isLength(password, { min: 8, max: undefined })
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid inputs" });
    }

    // validate email
    let emailNotTaken = await validateEmail(email);
    if (!emailNotTaken) {
      return res.status(400).json({
        success: false,
        message: "Email is taken!",
      });
    }
    let validRole = validateRole(role);
    if (!validRole) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const newUser = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      success: true,
      message: "User Registered.",
      newUser,
    });
  } catch (error) {
    next(error);
  }
};
const adminRegister = async (req, res, next) => {
  console.log(req.body)
  try {
    log.flag("signing up...");
    const { email, password, role } = req.body;
    

    if (
      !(
        validator.isEmail(email) &&
        validator.isLength(password, { min: 8, max: undefined })
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid inputs" });
    }

    // validate email
    let emailNotTaken = await validateEmail(email);
    if (!emailNotTaken) {
      return res.status(400).json({
        success: false,
        message: "Email is taken!",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const newUser = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      success: true,
      message: "Admin Registered.",
      newUser,
    });
  } catch (error) {
    log.error(error);
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    log.flag("logging in...");
    let { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: String(email).toLowerCase(),
      },
      include: {
        tutor: true,
        parent: true,
      },
    });
    console.log(user)
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Login Failed.",
      });
    }
    // compare hashed password
    let isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch)
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Login Failed." });

    const access_token = createAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refresh_token = createRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    refreshTokens.push(refresh_token);

    // res.cookie("refreshtoken", refresh_token);

    res.status(200).json({
      success: true,
      message: "Login success",
      refresh_token,
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tutor: user.tutor,
        parent: user.parent,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status:500,
      message: error.toString(),
    });
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    log.flag("logging in...");

    let { email, password } = req.body;
    console.log(email,password)
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
      include: {
        tutor: true,
        parent: true,
      },
    });
    console.log(user)
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "No User, Login Failed.",
      });
    }
    if (user.role == "PARENT" || user.role == "TUTOR") {
      return res.status(404).json({
        status: false,
        message: "Auth Failed, Login Failed.",
      });
    }

    // compare hashed password
    let isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Credential Error, Login Failed." });

    const access_token = createAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    console.log(access_token)
    const refresh_token = createRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    refreshTokens.push(refresh_token);

    // res.cookie("refreshtoken", refresh_token);

    res.status(200).json({
      success: true,
      message: "Login success",
      refresh_token,
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tutor: user.tutor,
        parent: user.parent,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status:500,
      message: error.toString(),
    });
    next(error);
  }
};

// email validate function
const validateEmail = async (email) => {
  let user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return user ? false : true;
};
// role validate function
const validateRole = (role) => {
  if (role === "ADMIN" || role === "SUPERADMIN") {
    return false;
  }
  if (role === "TUTOR" || role === "PARENT") {
    return true;
  }
};

module.exports = {
  userRegister,
  userLogin,
  adminRegister,
  adminLogin,
};
