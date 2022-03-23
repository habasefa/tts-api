const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const log = require("../lib/chalkLog");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { SECRET } = require("../config/index");

const adminRegister = async (req, res, next) => {
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
    // vlidate role
    let validRole = validateRole(role);
    if (!validRole) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // create a new user
    const newUser = await prisma.admin.create({
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
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    log.flag("logging in...");
    let { email, password } = req.body;
    console.log(req.body);
    const user = await prisma.admin.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Login Failed.",
      });
    }
    // compare hashed password
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // sign in token
      let token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        SECRET,
        {
          expiresIn: "24h",
        }
      );
      let result = {
        id: user.id,
        email: user.email,
        role: user.role,
        token: `Bearer ${token}`,
        expiresIn: 24,
      };
      return res.status(200).json({
        success: true,
        message: "Admin Logged in.",
        ...result,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Login Failed.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to Login",
    });
    next(error);
  }
};

// email validate function
const validateEmail = async (email) => {
  let user = await prisma.admin.findFirst({
    where: {
      email: email,
    },
  });
  return user ? false : true;
};
// role validate function
const validateRole = (role) => {
    if (role === "ADMIN" || role === "SUPERDMIN") {
      return true;
    }
    if (role === "TUTOR" || role === "PARENT") {
      return false;
    }
  };
  
module.exports = {
  adminRegister,
  adminLogin,
};
