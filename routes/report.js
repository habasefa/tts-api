require('dotenv').config()
const router = require('express').Router()
const { PrismaClient, Status } = require('@prisma/client')

const check_auth = require('../middlewares/check_auth')
const { createCalander } = require('../Utils/calenderCreator')
const { createViewToken, decodeToken } = require('../Utils/generateToken')
const { TTS_URL } = require('../Utils/url')
const {
    sendTelegramNotification,
    generateTelegramMessage,
} = require('../Utils/report')

const prisma = new PrismaClient()

router.post('/', check_auth, async (req, res, next) => {
    try {
        console.log(req.body)
        const weeks = createCalander(req.body.reportYear, req.body.reportMonth)
        console.log('weeks: ', weeks)

        const week = weeks[0]
        const countWeek = weeks[1]
        const reportsWithId = await prisma.report.findMany({
            where: {
                parentId: req.body.parentId,
                tutorId: req.body.tutorId,
                reportMonth: req.body.reportMonth,
                reportYear: req.body.reportYear,
            },
        })

        reportsWithId.map((repo, index) => {
            const date = repo.reportDate
            if (date >= week?.[0]?.[0] && date <= week?.[0]?.[1]) {
                countWeek[0] += 1
            } else if (date >= week?.[1]?.[0] && date <= week?.[1]?.[1]) {
                countWeek[1] += 1
            } else if (date >= week?.[2]?.[0] && date <= week?.[2]?.[1]) {
                countWeek[2] += 1
            } else if (date >= week?.[3]?.[0] && date <= week?.[3]?.[1]) {
                countWeek[3] += 1
            } else {
                countWeek[4] += 1
            }
        })
        let find = false
        const date = req.body.reportDate
        if (date >= week?.[0]?.[0] && date <= week?.[0]?.[1]) {
            if (countWeek[0] > 0) {
                find = true
            }
        } else if (date >= week?.[1]?.[0] && date <= week?.[1]?.[1]) {
            if (countWeek[1] > 0) {
                find = true
            }
        } else if (date >= week?.[2]?.[0] && date <= week?.[2]?.[1]) {
            if (countWeek[2] > 0) {
                find = true
            }
        } else if (date >= week?.[3]?.[0] && date <= week?.[3]?.[1]) {
            if (countWeek[3] > 0) {
                find = true
            }
        } else {
            if (countWeek[4] > 0) {
                find = true
            }
        }
        console.log(reportsWithId)
        if (find) {
            res.status(201).json({
                success: false,
                message: 'Report is submitted for the this specific week.',
                duplication: true,
            })
        } else {
            const report = await prisma.report.create({
                data: {
                    ...req.body,
                },
            })
            // console.log(req.body.tutorId, 'tutorId')
            // const updatedTutor = await prisma.tutor.update({
            //     where: {
            //         id: report.tutorId,
            //     },
            //     data: {
            //         reports: {
            //             connect: {
            //                 id: report.id,
            //             },
            //         },
            //     },
            //     include: {
            //         reports: true,
            //     },
            // })

            res.status(201).json({
                success: true,
                message: 'report Registered.',
                duplication: false,
                report,
            })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get(
    '/specific/:tutorId/:year/:month/:week',
    check_auth,
    async (req, res, next) => {
        const month = req.params.month
        const year = req.params.year
        const tutorId = req.params.tutorId
        const week = req.params.week
        console.log(week, year, tutorId, month)
        try {
            const reports = await prisma.report.findMany({
                where: {
                    reportMonth: Number(month),
                    reportYear: Number(year),
                    tutorId: tutorId,
                    week: week,
                },
                include: {
                    tutor: true,
                    parent: true,
                },
            })

            if (reports) {
                res.json({
                    success: true,
                    message: ' List of reports',
                    reports: reports,
                })
            } else {
                res.json({ success: false, message: `report not found` })
            }
        } catch (error) {
            next(error)
        }
    }
)

router.get('/sort/:year/:month', check_auth, async (req, res, next) => {
    const month = req.params.month
    const year = req.params.year
    console.log(year, month)
    try {
        const reports = await prisma.report.findMany({
            where: {
                reportMonth: Number(month),
                reportYear: Number(year),
            },
            include: {
                tutor: true,
            },
        })
        console.log(reports)
        if (reports) {
            res.json({
                success: true,
                message: ' List of reports',
                reports: reports,
            })
        } else {
            res.json({ success: false, message: `report not found` })
        }
    } catch (error) {
        next(error)
    }
})
router.get('/one/:id', check_auth, async (req, res, next) => {
    const val = req.params.id
    console.log(req.params)
    console.log(val)
    try {
        const reports = await prisma.report.findMany({
            where: {
                tutorId: val,
            },
            include: {
                tutor: true,
            },
        })
        console.log(reports)
        if (reports) {
            res.json({
                success: true,
                message: ' List of reports',
                reports: reports,
            })
        } else {
            res.json({ success: false, message: `report not found` })
        }
    } catch (error) {
        next(error)
    }
})

router.get('/one/rejected/:id', check_auth, async (req, res, next) => {
    const val = req.params.id
    console.log(req.params)
    console.log(val)
    try {
        const reports = await prisma.report.findMany({
            where: {
                tutorId: val,
                status: {
                    in: [Status.SUCCESS, Status.REJECTED],
                },
            },
            orderBy: [
                { reportYear: 'desc' },
                { reportMonth: 'desc' },
                { reportDate: 'desc' },
            ],
            include: {
                tutor: true,
            },
        })

        console.log(reports)
        if (reports) {
            res.json({
                success: true,
                message: ' List of reports',
                reports: reports,
            })
        } else {
            res.json({ success: false, message: `report not found` })
        }
    } catch (error) {
        next(error)
    }
})

router.get('/', check_auth, async (req, res, next) => {
    try {
        const users = await prisma.report.findMany({
            include: {
                tutor: true,
                parent: true,
            },
        })
        res.json({ success: true, message: 'List of reports', users: users })
    } catch (error) {
        next(error)
    }
})

router.get('/:id', check_auth, async (req, res, next) => {
    const { id } = req.params
    console.log(id)
    console.log('hi')

    try {
        const user = await prisma.report.findUnique({
            where: {
                id: id,
            },
            include: {
                // tutor: true,
            },
        })
        console.log(user)
        if (user) {
            res.json({ success: true, message: `report ${id}`, user: user })
        } else {
            res.json({ success: false, message: `report not found` })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.patch('/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        let viewUrl = ''
        console.log()
        if (req.body.status === Status.SUCCESS) {
            const token = createViewToken(
                {
                    reportId: id,
                },
                process.env.ACCESS_TOKEN_SECRET
            )
            viewUrl = `${TTS_URL}/view/report/${token}`
        }
        console.log(id, 'hi')
        const updatedUser = await prisma.report.update({
            where: {
                id: id,
            },
            data: { ...req.body, viewUrl: viewUrl },
            include: {
                tutor: true,
                parent: true,
            },
        })
        let telegramNotified = false
        if (req.body.status === Status.SUCCESS) {
            try {
                const parent = await prisma.parent.findUnique({
                    where: {
                        id: updatedUser.parentId,
                    },
                })
                sendTelegramNotification(
                    parent.telegramId,
                    generateTelegramMessage(viewUrl)
                )
                telegramNotified = true
            } catch {
                telegramNotified = false
            }
        }
        console.log(updatedUser, 'report')
        res.json({
            success: true,
            message: `Updated report ${id}`,
            telegramNotified,
            updatedUser,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    console.log(id, 'find')
    try {
        const deletedReport = await prisma.report.delete({
            where: {
                id: id,
            },
        })
        res.json({
            success: true,
            message: `Deleted report ${id}`,
            deletedReport,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.patch('/:id/approve', check_auth, async (req, res, next) => {
    const { id } = req.params
    try {
        let viewUrl = ''
        console.log()
        const token = createViewToken(
            {
                reportId: id,
            },
            process.env.ACCESS_TOKEN_SECRET
        )
        viewUrl = `${TTS_URL}/report/view/${token}`
        console.log(id, 'hi')
        const updatedUser = await prisma.report.update({
            where: {
                id: id,
            },
            data: { ...req.body, viewUrl: viewUrl },
            include: {
                tutor: true,
            },
        })
        const parent = await prisma.parent.findUnique({
            where: {
                id: updatedUser.parentId,
            },
        })
        sendTelegramNotification(
            parent.telegramId,
            generateTelegramMessage(viewUrl)
        )
        console.log(updatedUser, 'report')
        res.json({
            success: true,
            message: `Updated report ${id}`,
            updatedUser,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.patch('/:id/reject', check_auth, async (req, res, next) => {
    const { id } = req.params
    // console.log(id, 'find')
    // if (!validateAdmin(req.user.role)) {
    //     console.log(`Unauthorized ${req.user.role}`)

    //     return res.status(401).json({
    //         success: false,
    //         message: 'Unauthorized.',
    //     })
    // }
    try {
        const updatedReport = await prisma.report.update({
            where: {
                id: id,
            },
            data: {
                status: Status.REJECTED,
                comment: req.body.comment,
            },
            include: {
                // tutor: true,
            },
        })
        console.log(updatedReport.parentId, 'parentId')
        // const { parentId, ...reportData } = updatedReport

        // console.log(updatedParent.reports, 'reports')

        res.json({
            success: true,
            message: `Rejected report ${id}`,
            updatedReport,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})
router.patch('/:id/pending', check_auth, async (req, res, next) => {
    const { id } = req.params
    // console.log(id, 'find')
    // if (!validateAdmin(req.user.role)) {
    //     console.log(`Unauthorized ${req.user.role}`)

    //     return res.status(401).json({
    //         success: false,
    //         message: 'Unauthorized.',
    //     })
    // }
    try {
        const updatedReport = await prisma.report.update({
            where: {
                id: id,
            },
            data: {
                status: Status.PENDING,
                comment: req.body.comment,
            },
            include: {
                // tutor: true,
            },
        })
        console.log(updatedReport.parentId, 'parentId')
        // const { parentId, ...reportData } = updatedReport

        // console.log(updatedParent.reports, 'reports')

        res.json({
            success: true,
            message: `Pending report ${id}`,
            updatedReport,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})
router.get('/view/:token', async (req, res, next) => {
    const token = req.params.token
    try {
        console.log('token', token)
        const decoded = decodeToken(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decoded)
        const report = await prisma.report.findUnique({
            where: {
                id: decoded.reportId,
            },
            include: {
                tutor: true,
                parent: true,
            },
        })
        // console.log(report)
        if (report) {
            res.json({
                success: true,
                message: 'Report found',
                report,
            })
        } else {
            res.json({ success: false, message: `report not found` })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

const validateAdmin = (role) => {
    if (role === 'ADMIN' || role === 'SUPERDMIN') {
        return true
    }
    if (role === 'TUTOR' || role === 'PARENT') {
        return false
    }
}

module.exports = router
