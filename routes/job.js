require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const check_auth = require("../middlewares/check_auth");
const check_role = require("../middlewares/check_role");

const prisma = new PrismaClient();

router.post("/", check_auth, async (req, res, next) => {
  try {
    const job = await prisma.job.create({
      data: {
        ...req.body,
      },
    });
    res.status(201).json({
      success: true,
      message: "job Registered.",
      job,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.job.findMany({
      include: {
        tutors: true,
      },
    });
    res.json({ success: true, message: "List of jobs", users: users });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.job.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        tutors: true,
      },
    });
    if (user) {
      res.json({ success: true, message: `job ${id}`, user: user });
    } else {
      res.json({ success: false, message: `job not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.job.update({
      where: {
        id: Number(id),
      },
      data: req.body,
      include: {
        tutors: true,
      },
    });
    if (user) {
      res.json({ success: true, message: `job ${id}`, user: user });
    } else {
      res.json({ success: false, message: `job not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { tutorId } = req.body;
  try {
    const updatedUser = await prisma.job.update({
      where: {
        id: Number(id),
      },
      data: {
        tutors: {
          connect: { id: Number(tutorId) },
        },
      },
      include: {
        tutors: true,
      },
    });
    res.json({ success: true, message: `Updated job ${id}`, updatedUser });
  } catch (error) {
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
      const deletedUser = await prisma.job.delete({
        where: {
          id: Number(id),
        },
      });
      res.json({ success: true, message: `Deleted job ${id}`, deletedUser });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
