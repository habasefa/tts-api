require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const check_auth = require("../middlewares/check_auth");
const check_role = require("../middlewares/check_role");

const prisma = new PrismaClient();

router.post("/", check_auth, async (req, res, next) => {
  try {
    const tutor = await prisma.tutor.create({
      data: {
        ...req.body,
      },
    });
    res.status(201).json({
      success: true,
      message: "Tutor Registered.",
      tutor,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.tutor.findMany({
      include: {
        students: true,
        reports: true,
        jobs: true,
      },
    });
    res.json({ success: true, message: "List of Tutors", users: users });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.tutor.findUnique({
      where: {
        id: id,
      },
      include: {
        students: true,
        reports: true,
        jobs: true,
      },
    });
    if (user) {
      res.json({ success: true, message: `tutor ${id}`, user: user });
    } else {
      res.json({ success: false, message: `Tutor not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedUser = await prisma.tutor.update({
      where: {
        id: Number(id),
      },
      data: req.body,
      include: {
        students: true,
        jobs: true,
        reports: true,
      },
    });
    res.json({ success: true, message: `Updated tutor ${id}`, updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.tutor.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({ success: true, message: `Deleted tutor ${id}`, deletedUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
