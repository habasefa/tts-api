require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const check_auth = require("../middlewares/check_auth");
const check_role = require("../middlewares/check_role");

const prisma = new PrismaClient();

router.post("/", check_auth, async (req, res, next) => {
  try {
    const parent = await prisma.parent.create({
      data: {
        ...req.body,
      },
    });
    res.status(201).json({
      success: true,
      message: "Parent Registered.",
      parent,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.parent.findMany({
      include: {
        students: true,
      },
    });
    res.json({ success: true, message: "List of Parents", users: users });
  } catch (error) {
    next(error);
  }
});

router.get("/:email", check_auth, async (req, res, next) => {
  const { email } = req.params;
  try {
    const user = await prisma.parent.findUnique({
      where: {
        email: email,
      },
      include: {
        students: true,
      },
    });
    if (user) {
      res.json({ success: true, message: `user with ${email}`, user: user });
    } else {
      res.json({ success: false, message: `parent not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedUser = await prisma.parent.update({
      where: {
        id: Number(id),
      },
      data: req.body,
      include: {
        students: true,
      },
    });
    res.json({ success: true, message: `Updated parent ${id}`, updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.parent.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({ success: true, message: `Deleted parent ${id}`, deletedUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
