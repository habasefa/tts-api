require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../Utils/cloudinary");
const upload = require("../Utils/multer");
const check_auth = require("../middlewares/check_auth");
const check_role = require("../middlewares/check_role");
const fetch = require("node-fetch");

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
    console.log(error);
    next(error);
  }
});
router.get("/pending", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.tutor.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        students: true,
        reports: true,
        jobs: true,
      },
    });
    res.json({
      success: true,
      message: "List of Pending Tutors",
      users: users,
    });
  } catch (error) {
    next(error);
  }
});
router.get("/", check_auth, async (req, res, next) => {
  console.log("hi");
  try {
    const users = await prisma.tutor.findMany({
      where: {
        status: "SUCCESS",
      },
      include: {
        students: true,
        reports: true,
        jobs: true,
      },
    });
    console.log(users);
    res.json({ success: true, message: "List of Tutors", users: users });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/location/:location", check_auth, async (req, res, next) => {
  const { location } = req.params;
  console.log(location);
  try {
    const users = await prisma.tutor.findMany({
      where: {
        location: String(location),
      },
      include: {
        students: true,
        reports: true,
        jobs: true,
      },
    });
    console.log(users);
    res.json({ success: true, message: "List of Tutors", users: users });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
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
    console.log(user);
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
  console.log(id);
  try {
    const updatedUser = await prisma.tutor.update({
      where: {
        id: id,
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
    console.log(error);
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { studentId } = req.body;
  try {
    const updatedUser = await prisma.tutor.update({
      where: {
        id: id,
      },
      data: {
        students: {
          connect: { id: studentId },
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
          id: id,
        },
      });
      res.json({ success: true, message: `Deleted tutor ${id}`, deletedUser });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/fetchTimeSheet", check_auth, async (req, res, next) => {
  try {
    const timeSheets = await prisma.image.findMany({
      where: {
        tutorId: true,
      },
    });
    res.json({ success: true, message: "Fetched timesheets", timeSheets });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
router.get("/fetchTimeSheet/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;

  try {
    const timeSheets = await prisma.image.findMany({
      where: {
        id: id,
      },
    });
    res.json({ success: true, message: "List of timeSheets", timeSheets });
  } catch (err) {
    console.log(err);
    next(err);
  }
});
router.post("/followUp", check_auth, async (req, res, next) => {
  try {
    const tutorFollowUp = await prisma.tutorFollowup.create({
      data: {
        ...req.body,
      },
    });

    res.status(201).json({
      success: true,
      message: "Tutor follow Up Registered.",
      followUp: tutorFollowUp ,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/followUp:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const user = await prisma.tutorFollowup.findUnique({
      where: {
        id: id,
      },
      include: {
        tutor:true
      },
    });
    console.log(user);
    if (user) {
      res.json({ success: true, message: `tutor ${id}`, user: user });
    } else {
      res.json({ success: false, message: `Tutor not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/followUp:year", check_auth, async (req, res, next) => {
  const { year } = req.params;
  console.log(year);
  try {
    const user = await prisma.tutorFollowup.findMany({
      where: {
        year: Number(year),
      },
      include: {
        tutor:true
      },
    });
    console.log(user);
    if (user) {
      res.json({ success: true, message: "List of Pending Tutors", user: user });
    } else {
      res.json({ success: false, message: `tutor followUp was found` });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/sendMessage", async (req, res, next) => {
  console.log("hi");
});
router.post(
  "/upload",
  check_auth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      // Upload image to cloudinary

      console.log(req.body.data);
      console.log(req.body);
      const result = await cloudinary.uploader.upload(req.file.path);
      // Create new user
      console.log(result.url);
      const data = JSON.parse(req.body.data);
      console.log(data);

      const image = await prisma.image.create({
        data: {
          tutorId: data?.tutorId,
          listStudent: data?.listStudent,
          parentId: data?.parentId,
          month: data?.month,
          cloudinary_id: result.url,
          year: data?.year,
        },
      });
      console.log(image);
      res.json({ success: true, message: "Image Created", image });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);
router.get("/fetchImage/:year", check_auth, async (req, res, next) => {
  const year = req.params.year;
  console.log(year);
  try {
    const timeSheets = await prisma.image.findMany({
      where: {
        year: Number(year),
      },
      include: {
        tutor: true,
        parent: true,
      },
    });
    console.log(timeSheets);
    if (timeSheets) {
      res.json({
        success: true,
        message: " List of TimeSheets",
        timeSheets: timeSheets,
      });
    } else {
      res.json({ success: false, message: `timeSheet not found` });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.patch("/image/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id, "hi");
  try {
    const updatedUser = await prisma.image.update({
      where: {
        id: id,
      },
      data: req.body,
      include: {
        tutor: true,
        parent: true,
      },
    });
    const phone = updatedUser.parent.phone1;
    const TOKEN = process.env.MESSAGE_TOKEN;
    const IDENTIFIER_ID = process.env.IDENTIFIER_ID;
    const SENDER_NAME = "";
    const RECIPIENT = phone;
    const MESSAGE = `Dear Parents, Temaribet reminding you to pay for your monthly tutoring session with ${updatedUser.tutor.fullName}. Please ensure payment by month end. Thank you`;
    const CALLBACK = "https://temaribet-api.onrender.com";

    const requestBody = {
      from: IDENTIFIER_ID,
      sender: SENDER_NAME,
      to: RECIPIENT,
      message: MESSAGE,
      callback: CALLBACK,
    };
    fetch("https://api.afromessage.com/api/send", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
    console.log(updatedUser, "image");

    res.json({ success: true, message: `Updated image ${id}`, updatedUser });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
