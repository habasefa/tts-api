// controllers/parentController.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Get parent by phone number
exports.getParentByPhoneNumber = async (req, res, next) => {
    const { phoneNumber } = req.params
    try {
        if (!phoneNumber) {
            return res.status(404).json({
                success: false,
                message: 'Parent not found',
            })
        }

        const parent = await prisma.parent.findFirst({
            where: { phone1: `${phoneNumber}` },
            include: { students: true },
        })

        if (parent) {
            res.json({
                success: true,
                message: `Parent ${phoneNumber}`,
                user: parent,
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Parent not found',
            })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

// Get parent by Telegram username
exports.getParentByUsername = async (req, res, next) => {
    const { username } = req.params
    try {
        const parent = await prisma.parent.findFirst({
            where: { telegramUsername: `@${username}` },
            include: { students: true },
        })

        if (parent) {
            res.json({
                success: true,
                message: `Parent ${username}`,
                user: parent,
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Parent not found',
            })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

// Update parent's Telegram ID
exports.updateParentTelegramId = async (req, res, next) => {
    const { id } = req.params
    const { telegramId } = req.body

    try {
        const updatedParent = await prisma.parent.update({
            where: { id },
            data: { telegramId },
        })

        res.status(200).json({
            success: true,
            message: 'Parent Telegram ID updated',
            user: updatedParent,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.getParentByTelegramId = async (req, res, next) => {
    const { telegramId } = req.params
    console.log(telegramId)
    try {
        const parent = await prisma.parent.findFirst({
            where: { telegramId: +telegramId },
            include: { students: true },
        })
        if (parent) {
            res.json({
                success: true,
                message: `Parent ${telegramId}`,
                user: parent,
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Parent not found',
            })
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}
