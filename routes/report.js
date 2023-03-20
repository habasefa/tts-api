require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const check_auth = require("../middlewares/check_auth");
const { createCalander } = require("../Utils/calenderCreator");

const prisma = new PrismaClient();

router.post("/", check_auth, async (req, res, next) => {
  try {
    console.log(req.body);
    const weeks = createCalander(req.body.reportYear, req.body.reportMonth);
    const week = weeks[0];
    const countWeek = weeks[1];
    const reportsWithId = await prisma.report.findMany({
      where: {
        tutorId: req.body.tutorId,
        reportMonth: req.body.reportMonth,
        reportYear: req.body.reportYear,
      },
    });

    reportsWithId.map((repo, index) => {
      const date = repo.reportDate;
      if (date >= week?.[0]?.[0] && date <= week?.[0]?.[1]) {
        countWeek[0] += 1;
      } else if (date >= week?.[1]?.[0] && date <= week?.[1]?.[1]) {
        countWeek[1] += 1;
      } else if (date >= week?.[2]?.[0] && date <= week?.[2]?.[1]) {
        countWeek[2] += 1;
      } else if (date >= week?.[3]?.[0] && date <= week?.[3]?.[1]) {
        countWeek[3] += 1;
      } else {
        countWeek[4] += 1;
      }
    });
    let find = false;
    const date = req.body.reportDate;
    if (date >= week?.[0]?.[0] && date <= week?.[0]?.[1]) {
      if (countWeek[0] > 0) {
        find = true;
      }
    } else if (date >= week?.[1]?.[0] && date <= week?.[1]?.[1]) {
      if (countWeek[1] > 0) {
        find = true;
      }
    } else if (date >= week?.[2]?.[0] && date <= week?.[2]?.[1]) {
      if (countWeek[2] > 0) {
        find = true;
      }
    } else if (date >= week?.[3]?.[0] && date <= week?.[3]?.[1]) {
      if (countWeek[3] > 0) {
        find = true;
      }
    } else {
      if (countWeek[4] > 0) {
        find = true;
      }
    }
    console.log(reportsWithId)
    if (find) {
      res.status(201).json({
        success: false,
        message: "Report is submitted for the this specific week.",
        duplication: true,
      });
    } else {
      const report = await prisma.report.create({
        data: {
          ...req.body,
        },
      });
      console.log(report);
      res.status(201).json({
        success: true,
        message: "report Registered.",
        duplication: false,
        report,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/sort/:year/:month", check_auth, async (req, res, next) => {
  const month = req.params.month;
  const year = req.params.year;
  console.log(year, month);
  try {
    const reports = await prisma.report.findMany({
      where: {
        reportMonth: Number(month),
        reportYear: Number(year),
      },
      include: {
        tutor: true,
      },
    });
    console.log(reports);
    if (reports) {
      res.json({
        success: true,
        message: " List of reports",
        reports: reports,
      });
    } else {
      res.json({ success: false, message: `report not found` });
    }
  } catch (error) {
    next(error);
  }
});
router.get("/one/:id", check_auth, async (req, res, next) => {
  const val = req.params.id;
  console.log(req.params);
  console.log(val);
  try {
    const reports = await prisma.report.findMany({
      where: {
        tutorId: val,
      },
      include: {
        tutor: true,
      },
    });
    console.log(reports);
    if (reports) {
      res.json({
        success: true,
        message: " List of reports",
        reports: reports,
      });
    } else {
      res.json({ success: false, message: `report not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/one/rejected/:id", check_auth, async (req, res, next) => {
  const val = req.params.id;
  console.log(req.params);
  console.log(val);
  try {
    const reports = await prisma.report.findMany({
      where: {
        tutorId: val,
        status:"FAILED"
      },
      include: {
        tutor: true,
      },
    });
    console.log(reports);
    if (reports) {
      res.json({
        success: true,
        message: " List of reports",
        reports: reports,
      });
    } else {
      res.json({ success: false, message: `report not found` });
    }
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
  console.log(id);
  console.log("hi")

  try {
    const user = await prisma.report.findUnique({
      where: {
        
        id: id,
      },
      include: {
        tutor: true,
      },
    });
    console.log(user);
    if (user) {
      res.json({ success: true, message: `report ${id}`, user: user });
    } else {
      res.json({ success: false, message: `report not found` });
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id,"hi")
  try {
    const updatedUser = await prisma.report.update({
      where: {
        id: id,
      },
      data: req.body,
      include: {
        tutor: true,
      },
    
    });
    console.log(updatedUser,"report")
    res.json({ success: true, message: `Updated report ${id}`, updatedUser });
  } catch (error) {
    console.log(error)
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id,'find')
  try {
    const deletedUser = await prisma.report.delete({
      where: {
        id: id,
      },
    });
    res.json({ success: true, message: `Deleted report ${id}`, deletedUser });
  } catch (error) {
    console.log(error)
    next(error);
    
  }
});

module.exports = router;
