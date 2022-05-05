require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const check_auth = require("../middlewares/check_auth");
const check_role = require("../middlewares/check_role");

const prisma = new PrismaClient();

router.post(
  "/",
  //   check_role(["PARENT", "ADMIN"]),
  async (req, res, next) => {
    try {
      const student = await prisma.student.create({
        data: {
          ...req.body,
        },
      });
      res.status(201).json({
        success: true,
        message: "student Registered.",
        student,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.student.findMany({
      include: {
        parent: true,
        tutor: true,
      },
    });
    res.json({ success: true, message: "List of students", users: users });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        parent: true,
        tutor: true,
      },
    });
    if (user) {
      res.json({ success: true, message: `student ${id}`, user: user });
    } else {
      res.json({ success: false, message: `student not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedUser = await prisma.student.update({
      where: {
        id: Number(id),
      },
      data: req.body,
      include: {
        parent: true,
        tutor: true,
      },
    });
    res.json({ success: true, message: `Updated student ${id}`, updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.student.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({ message: `Deleted student ${id}`, deletedUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
