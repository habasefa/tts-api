// controllers/tutorController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getTutorByPhoneNumber = async (req, res, next) => {
    const { phoneNumber } = req.params
    try {
        if (!phoneNumber) {
            return res.status(404).json({
                success: false,
                message: 'Tutor not found',
            })
        }

        const tutor = await prisma.tutor.findFirst({
            where: { phone: `${phoneNumber}` },
            include: { students: true },
        })

        if (tutor) {
            res.json({
                success: true,
                message: `Tutor ${phoneNumber}`,
                user: tutor,
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Tutor not found',
            })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

// Get tutor by Telegram username
exports.getTutorByUsername = async (req, res, next) => {
    const { username } = req.params
    try {
        const tutor = await prisma.tutor.findFirst({
            where: { telegramUsername: `@${username}` },
        })

        if (tutor) {
            res.json({
                success: true,
                message: `Tutor ${username}`,
                user: tutor,
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Tutor not found',
            })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

// Update tutor's Telegram ID
exports.updateTutorTelegramId = async (req, res, next) => {
    const { id } = req.params
    const { telegramId } = req.body

    try {
        const updatedTutor = await prisma.tutor.update({
            where: { id },
            data: { telegramId },
        })

        res.status(200).json({
            success: true,
            message: 'Tutor Telegram ID updated',
            user: updatedTutor,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.getTutorByTelegramId = async (req, res, next) => {
    const { telegramId } = req.params
    console.log(telegramId)

    try {
        const tutor = await prisma.tutor.findFirst({
            where: { telegramId: +telegramId },
            include: {
                jobs: true,
            },
        })

        console.log(tutor)
        if (tutor) {
            res.json({
                success: true,
                message: `Tutor ${telegramId}`,
                user: tutor,
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Tutor not found',
            })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}
