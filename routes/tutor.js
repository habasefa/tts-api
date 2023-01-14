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
router.get("/pending", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.tutor.findMany({
      where :{
        status : "PENDING"
      },
      include: {
        students: true,
        reports: true,
        jobs: true,
      },
    });
    res.json({ success: true, message: "List of Pending Tutors", users: users });
  } catch (error) {
    next(error);
  }
});
router.get("/", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.tutor.findMany({
      where :{
        status : "SUCCESS"
      },
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

router.get("/location/:location", check_auth, async (req, res, next) => {
  const {location} =req.params;
  console.log(location)
  try {
    const users = await prisma.tutor.findMany({
      where :{
        location:String(location)
      },
      include: {
        students: true,
        reports: true,
        jobs: true,
      },
    });
    console.log(users)
    res.json({ success: true, message: "List of Tutors", users: users });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  try {
    const user = await prisma.tutor.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        students: true,
        reports: true,
        jobs: true,
      },
    });
    console.log(user)
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
  console.log(id)
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

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { studentId } = req.body;
  try {
    const updatedUser = await prisma.tutor.update({
      where: {
        id: Number(id),
      },
      data: {
        students: {
          connect: { id: Number(studentId) },
        },
      },
      include: {
        students: true,
      },
    });
    res.json({ success: true, message: `Updated tutor ${id}`, updatedUser });
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
      const deletedUser = await prisma.tutor.delete({
        where: {
          id: Number(id),
        },
      });
      res.json({ success: true, message: `Deleted tutor ${id}`, deletedUser });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
