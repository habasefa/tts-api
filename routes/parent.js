require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const check_auth = require("../middlewares/check_auth");
const check_role = require("../middlewares/check_role");

const prisma = new PrismaClient();

router.post("/", async (req, res, next) => {
  try {
    const parent = await prisma.parent.findUnique({
      where: {
       phone1:req.body.phone1 ,
      },
      include: {
        students: true,
      },
    });
    if (!parent)
    {
    
    const parent = await prisma.parent.create({
      data: {
        ...req.body,
      },
    });
  
    
    let date = new Date()

    let months=date.getMonth()+1

    let years = date.getFullYear()
    console.log(months,years)
    const result = '' + years + months;
    console.log(result)
    const yearWithMonth = await prisma.parentInYear.findUnique({
      where :
      {
      id:Number(result)
        


      }
    })
    console.log(yearWithMonth)
    if (yearWithMonth)
    {
      const increment =await prisma.parentInYear.update({
        where: {

          id : Number(result)
        },
        data: {
          
          parentRegisterNumber: {increment: 1}}
      });
      console.log(increment)

    }
    else{
      const createdYearWithMonth = await prisma.parentInYear.create({
        data:{
          id : Number(result),
          year: years,
          month:months
        }
      })
      .then(async (data)=>{
        const increment =await prisma.parentInYear.update({
          where: {

            id : Number(result)
          },
          data: {
            
            parentRegisterNumber: {increment: 1}}
        });
      console.log(increment)

      })

    }

  
  
    console.log(parent)
    res.status(201).json({
      success: true,
      message: "Parent Registered.",
      parent,
    });
  }
  else{
    res.status(201).json({
      success: true,
      message: "Parent Existed.",
      parent,
    });
  }
  } catch (error) {
    next(error);
  }
});

router.get("/pending", check_auth, async (req, res, next) => {
  try {
    const users = await prisma.parent.findMany({
      where :{
        
        status : "PENDING"
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
        id: Number(id),
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
          id: Number(id),
        },
      });
      console.log(deletedUser)
      res.json({ success: true, message: `Deleted parent ${id}`, deletedUser });
    } catch (error) {
      console.log(errror)
      next(error);
    }
  }
);

module.exports = router;
