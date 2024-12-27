const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.createJob = async (req, res, next) => {
    try {
        const job = await prisma.job.create({
            data: {
                ...req.body,
            },
        })
        res.status(201).json({
            success: true,
            message: 'job Registered.',
            job,
        })
    } catch (error) {
        next(error)
    }
}

exports.getJobs = async (req, res, next) => {
    try {
        const users = await prisma.job.findMany({
            include: {
                tutors: true,
            },
        })
        res.json({ success: true, message: 'List of jobs', users: users })
    } catch (error) {
        next(error)
    }
}

exports.getJobById = async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await prisma.job.findUnique({
            where: {
                id: id,
            },
            include: {
                tutors: true,
            },
        })
        if (user) {
            res.json({ success: true, message: `job ${id}`, user: user })
        } else {
            res.json({ success: false, message: `job not found` })
        }
    } catch (error) {
        next(error)
    }
}

exports.updateJob = async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await prisma.job.update({
            where: {
                id: id,
            },
            data: req.body,
            include: {
                tutors: true,
            },
        })
        if (user) {
            res.json({ success: true, message: `job ${id}`, user: user })
        } else {
            res.json({ success: false, message: `job not found` })
        }
    } catch (error) {
        next(error)
    }
}

exports.addTutor = async (req, res, next) => {
    const { id } = req.params
    const { tutorId } = req.body
    try {
        const updatedUser = await prisma.job.update({
            where: {
                id: id,
            },
            data: {
                tutors: {
                    connect: { id: tutorId },
                },
            },
            include: {
                tutors: true,
            },
        })
        res.json({ success: true, message: `Updated job ${id}`, updatedUser })
    } catch (error) {
        next(error)
    }
}

exports.deleteJob = async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedUser = await prisma.job.delete({
            where: {
                id: id,
            },
        })
        res.json({ success: true, message: `Deleted job ${id}`, deletedUser })
    } catch (error) {
        next(error)
    }
}
