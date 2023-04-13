require("dotenv").config();
const router = require("express").Router();
const { PrismaClient, Status } = require("@prisma/client");

const check_auth = require("../middlewares/check_auth");
const check_role = require("../middlewares/check_role");

const prisma = new PrismaClient();

router.post("/", async (req, res, next) => {
  try {
   
    console.log(req.body)
    const parent = await prisma.parent.create({
      data: {
        ...req.body,
      },
    });
  
    console.log(parent,"created parent")
    let date = new Date()

    let months=date.getMonth()+1

    let years = date.getFullYear()
    console.log(months,years)
    const result = '' + years + months;
    const createdUpdatedparentInyear =await prisma.$transaction([
      prisma.parentInYear.upsert({
        where: {
          id: result
        },
        update: {
          parentRegisterNumber : {
            increment: 1
          }
        },
        create: {
          id: result,
          parentRegisterNumber: 1,
          month: months,
          year : years
        }
      })
    ]);
    console.log(createdUpdatedparentInyear)

    

  
   
    console.log(parent,"created parent")
    res.status(201).json({
      success: true,
      message: "Parent Registered.",
      parent,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
});

router.get("/pending", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.parent.findMany({
      where: {
        status: "PENDING"
      },
      include: {
        students: true
      }
    });

    // Map the `parent` objects to include their creation time
    const formattedUsers = users.map(user => {
      const timestamp = parseInt(user.id.toString().substring(0, 8), 16) * 1000; // Extract the creation time from the `ObjectId`
      const createdAt = new Date(timestamp).toLocaleString(); // Convert the timestamp to a readable date and time string
      return {
        ...user,
        createdAt
      };
    });

    // Sort the `formattedUsers` array by creation time
    formattedUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    


    res.json({ success: true, message: "List of Parents", users: formattedUsers });
    // const users = await prisma.parent.findMany({
    //   where :{
        
    //     status : "PENDING"
    //   },
    //   include: {
    //     students: true,
    //   },
    // });
    // res.json({ success: true, message: "List of Parents", users: users });
  } catch (error) {
    console.log(error)
    next(error);
  }
});
router.get("/failed", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.parent.findMany({
      where :{
        
        status : Status.FAILED
      },
      include: {
        students: true,
      },
    });
    res.json({ success: true, message: "List of fAILED Parents", users: users });
  } catch (error) {
    next(error);
  }
});

router.get('/basedOnMonth',check_auth,async(req,res,next)=>{

  let date = new Date()
  let year = date.getFullYear()
  console.log(year)
  try{
    const years = await prisma.parentInYear.findMany({
      where :{
        year:year

      }
    })
    res.json({success: true , message:"Number of Parents based on their registered Month", numberinMonths: years })

  }
  catch(error){
    next(error)
  }
})
router.get("/", check_auth, async (req, res, next) => {
  console.log("hi")
  
  try {
    const users = await prisma.parent.findMany({
      where :{
        status : "SUCCESS"
      },
      include: {
        students: true,
      },
    });
    res.json({ success: true, message: "List of Parents", users: users });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.parent.findUnique({
      where: {
        id: id,
      },
      include: {
        students: true,
      },
    });
    if (user) {
      res.json({ success: true, message: `user with ${id}`, user: user });
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
        id: id,
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
router.post("/followUp", check_auth, async (req, res, next) => {
  try {
    const tutorFollowUp = await prisma.parentFollowup.create({
      data: {
        ...req.body,
      },
    });

    res.status(201).json({
      success: true,
      message: "Parent follow Up Registered.",
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
    const user = await prisma.parentFollowup.findUnique({
      where: {
        id: id,
      },
      include: {
        tutor:true
      },
    });
    console.log(user);
    if (user) {
      res.json({ success: true, message: `parent follow up ${id}`, user: user });
    } else {
      res.json({ success: false, message: `Parent follow up not found` });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/followUp:year", check_auth, async (req, res, next) => {
  const { year } = req.params;
  console.log(year);
  try {
    const user = await prisma.parentFollowup.findMany({
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
      res.json({ success: false, message: `Parent followUp was found` });
    }
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
    console.log(id)
    try {
      const deletedUser = await prisma.parent.delete({
        where: {
          id: id,
        },
      });
      console.log(deletedUser)
      res.json({ success: true, message: `Deleted parent ${id}`, deletedUser });
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
);

module.exports = router;
