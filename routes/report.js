require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const check_auth = require("../middlewares/check_auth");
const check_role = require("../middlewares/check_role");

const prisma = new PrismaClient();

router.post("/", async (req, res, next) => {
  try {
    const report = await prisma.report.create({
      data: {
        ...req.body,
      },
    });
    res.status(201).json({
      success: true,
      message: "report Registered.",
      report,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.report.findMany({
      include: {
        tutor: true,
      },
    });
    res.json({ success: true, message: "List of reports", users: users });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.report.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        tutor: true,
      },
    });
    if (user) {
      res.json({ success: true, message: `report ${id}`, user: user });
    } else {
      res.json({ success: false, message: `report not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedUser = await prisma.report.update({
      where: {
        id: Number(id),
      },
      data: req.body,
      include: {
        tutor: true,
      },
    });
    res.json({ success: true, message: `Updated report ${id}`, updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.report.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({ success: true, message: `Deleted report ${id}`, deletedUser });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
