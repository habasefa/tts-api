require('dotenv').config()
const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Find a parent by their Telegram username
router.get('/parent/:username', async (req, res, next) => {
    const { username } = req.params
    try {
        const parent = await prisma.parent.findFirst({
            where: {
                telegramUsername: `@${username}`,
            },
            include: {
                students: true,
            },
        })
        if (parent) {
            res.json({
                success: true,
                message: `parent ${username}`,
                user: parent,
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Parent not found',
            })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// Update parent's Telegram ID
router.patch('/parent/:id/telegram-id', async (req, res, next) => {
    const { id } = req.params
    const { telegramId } = req.body

    try {
        const updatedParent = await prisma.parent.update({
            where: {
                id,
            },
            data: {
                telegramId,
            },
        })
        res.status(200).json({
            success: true,
            message: 'Parent Telegram ID updated',
            user: updatedParent,
        })
    } catch (error) {
        next(error)
    }
})

// Find a tutor by their Telegram username
router.get('/tutor/:username', async (req, res, next) => {
    const { username } = req.params
    try {
        const tutor = await prisma.tutor.findFirst({
            where: {
                telegramUsername: `@${username}`,
            },
        })
        if (tutor) {
            res.json({
                success: true,
                message: `tutor ${username}`,
                user: tutor,
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Tutor not found',
            })
        }
    } catch (error) {
        next(error)
    }
})

// Update tutor's Telegram ID
router.patch('/tutor/:id/telegram-id', async (req, res, next) => {
    const { id } = req.params
    const { telegramId } = req.body

    try {
        const updatedTutor = await prisma.tutor.update({
            where: {
                id,
            },
            data: {
                telegramId,
            },
        })
        res.status(200).json({
            success: true,
            message: 'Tutor Telegram ID updated',
            user: updatedTutor,
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router
