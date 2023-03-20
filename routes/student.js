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
      console.log(req.body)
      const student = await prisma.student.create({
        data: {
          ...req.body,
        },
      });
   

      
        if (req.body.grade=="K-G"){
         
         const updatedGrades =await prisma.$transaction([   prisma.grades.upsert({
          where: {
            id: 1,
          },
          update: {
            kG: {
              increment: 1,
            },
          },
          create: {
            id: 1,
            kG: 1,
          },
        })])
        }

       else if (req.body.grade=="5" || req.body.grade=="6"){
        const updatedGrades =await prisma.$transaction([   prisma.grades.upsert({
          where: {
            id: 1,
          },
          update: {
            from5To6: {
              increment: 1,
            },
          },
          create: {
            id: 1,
            from5To6: 1,
          },
        })])
        }
        else if (req.body.grade=="7" || req.body.grade=="8"){
          const updatedGrades =await prisma.$transaction([   prisma.grades.upsert({
            where: {
              id: 1,
            },
            update: {
              from7To8: {
                increment: 1,
              },
            },
            create: {
              id: 1,
              from7To8: 1,
            },
          })])
         
        }
        else if (req.body.grade=="9" || req.body.grade=="10"){
          const updatedGrades =await prisma.$transaction([   prisma.grades.upsert({
            where: {
              id: 1,
            },
            update: {
              from9To10: {
                increment: 1,
              },
            },
            create: {
              id: 1,
              from9To10: 1,
            },
          })])
         
        }
        else if (req.body.grade=="11" || req.body.grade=="12"){
          const updatedGrades =await prisma.$transaction([   prisma.grades.upsert({
            where: {
              id: 1,
            },
            update: {
              from11T012: {
                increment: 1,
              },
            },
            create: {
              id: 1,
              from11T012: 1,
            },
          })])
          
        }
        else{
        
          const updatedGrades =await prisma.$transaction([   prisma.grades.upsert({
            where: {
              id: 1,
            },
            update: {
              from1Ton4: {
                increment: 1,
              },
            },
            create: {
              id: 1,
              from1Ton4: 1,
            },
          })])
        

        }
        
        
        console.log()
       
    
      res.status(201).json({
        success: true,
        message: "student Registered.",
        student,
      });
    } catch (error) {
     console.log(error)
      next(error);
    }
  }
);

router.get("/useParent/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  console.log("hi")
  try {
    const users = await prisma.student.findMany({
      where: {
        parentId: id,
      },
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
router.get('/byGrade',check_auth,async (req,res,next)=>{
  try{
    const gradeNumber = await prisma.grades.findUnique({
      where:{
        id:1
      }
    })
    res.json({success: true, message : "Number of Students in their respective grade", gradeNumber: gradeNumber });

    
  }
  catch(error){
    next(error);
  }
})

router.get("/:id", check_auth, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.student.findUnique({
      where: {
        id: id,
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
        id: id,
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

router.delete(
  "/:id",
  check_auth,
  check_role("ADMIN"),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const deletedUser = await prisma.student.delete({
        where: {
          id: id,
        },
      });
      res.json({ message: `Deleted student ${id}`, deletedUser });
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
