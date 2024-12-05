require('dotenv').config()
const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')

const check_auth = require('../middlewares/check_auth')
const { adminRegister, adminLogin } = require('../Utils/adminAuth')

const prisma = new PrismaClient()

// Register Admin
router.post('/register', async (req, res, next) => {
    await adminRegister(req, res, next)
})

// Login Admins
router.post('/login', async (req, res, next) => {
    await adminLogin(req, res, next)
})

router.get('/', check_auth, async (req, res, next) => {
    try {
        const users = await prisma.admin.findMany()
        res.json({ success: true, message: 'List of admins', users: users })
    } catch (error) {
        next(error)
    }
})

router.get('/:id', check_auth, async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await prisma.admin.findUnique({
            where: {
                id: id,
            },
        })
        if (user) {
            res.json({ success: true, message: `admin ${id}`, user: user })
        } else {
            res.json({ success: false, message: `admin not found` })
        }
    } catch (error) {
        next(error)
    }
})

router.patch('/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        const updatedUser = await prisma.admin.update({
            where: {
                id: id,
            },
            data: req.body,
        })
        res.json({ success: true, message: `Updated admin ${id}`, updatedUser })
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params
    try {
        const deletedUser = await prisma.admin.delete({
            where: {
                id: id,
            },
        })
        res.json({ success: true, message: `Deleted admin ${id}`, deletedUser })
    } catch (error) {
        next(error)
    }
})

module.exports = router
