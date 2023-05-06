require("dotenv").config();
const generator = require('generate-password');
const emailjs = require('@emailjs/nodejs');
const bcrypt = require("bcrypt");
const router = require("express").Router();
const {
  userRegister,
  userLogin,
  adminRegister,
  adminLogin,
} = require("../Utils/auth");
const { PrismaClient } = require("@prisma/client");
const check_auth = require("../middlewares/check_auth");
const check_role = require("../middlewares/check_role");

let rT = require("../config/refreshTokens");
let refreshTokens = rT.refreshTokens;

const prisma = new PrismaClient();

// Register User
router.post("/register", async (req, res, next) => {
  await userRegister(req, res, next);
});
// Register Admin
router.post(
  "/adminRegister",
  // check_role("SUPERADMIN"),
  async (req, res, next) => {
    await adminRegister(req, res, next);
  }
);
// Login User
router.post("/login", async (req, res, next) => {
  // console.log(req)
  await userLogin(req, res, next);
});
// Login Admin
router.post("/adminLogin", async (req, res, next) => {
  await adminLogin(req, res, next);
});

router.post("/logout", check_auth, (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.status(200).json("You logged out successfully.");
});

router.get("/", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true, message: "List of Users", users: users });
  } catch (error) {
    res.json({ success: false, message: "Something went wrong." });
    next(error);
  }
});

router.get("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  try {
    const user = await prisma.user.findUnique({
      where: {
        id:id,
      },
      include: {
        tutor: true,
        parent: true,
      },
    });
    if (user) {
      res.json(user);
    } else {
      res.json({ success: true, message: `User not found` });
    }
  } catch (error) {
    res.json({ success: false, message: error.toString() });
    next(error);
  }
});

router.patch("/forgotPassword", async (req, res, next) => {
  
  const {email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email:email
      },
      include: {
        tutor: true,
        parent: true,
      },
    });
    console.log(user)
    
    const password = generator.generate({
      length: 10,
      numbers: true
    });
    console.log(password)
    const hashedPassword = await bcrypt.hash(password, 10);
    const templateParams = {
      
      to_email: user.email,
      message: `Your new Password ${password }.`,
    }

    prisma.user.update({
      where: {
        email:email
      },
      include: {
        tutor: true,
        parent: true,
      },
      data: {   
        ...req.body,
        password : hashedPassword,
      },
    }).then((updatedUser)=>{
      
       emailjs
        .send(
          process.env.EMAIL_SERVICE_ID,
           process.env.EMAIL_TEMPLATE_ID,
           templateParams,
          {
            publicKey: process.env.EMAIL_PUBLIC_KEY,
    privateKey:process.env.EMAIL_PRIVATE_KEY, 
          }
          )
           .then(
           (response) => {
            
            res.json({
              success: true,
              message: `Email is Sent`,
              user: response,
            });
          },
          (err) => {
            res.json({ success: false, message: "Something went wrong." });
            next(err);
              }
          )
    })
   
   
 
});


router.patch("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  const {password,oldPassword } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.findFirst({
      where: {
        id:id
      },
      include: {
        tutor: true,
        parent: true,
      },
    });
    // compare hashed password
    let isMatch = await bcrypt.compare(oldPassword, user.password);
    console.log(isMatch)
    if (!isMatch)
      return res.status(400).json({ success: false, message: " Please enter correct old password " });
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      include: {
        tutor: true,
        parent: true,
      },
      data: {
        password : hashedPassword,
      },
    });
    console.log(updatedUser)
    res.json({
      success: true,
      message: `Updated user ${id}`,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message:error });
    next(error);
  }
});

router.delete(
  "/:id",
  check_auth,
  check_role("ADMIN"),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const deletedUser = await prisma.user.delete({
        where: {
          id: id,
        },
      });
      res.json({
        success: true,
        message: `Deleted user ${id}`,
        user: deletedUser,
      });
    } catch (error) {
      res.json({ success: false, message: "Something went wrong." });
      next(error);
    }
  }
);

module.exports = router;
