require('dotenv').config()
const express = require('express')
const router = express.Router()
const parentController = require('../controllers/parent')
const tutorController = require('../controllers/tutor')
const jobController = require('../controllers/job')

// Parent routes
router.get(
    '/parent/phone-number/:phoneNumber',
    parentController.getParentByPhoneNumber
)
router.get('/parent/username/:username', parentController.getParentByUsername)
router.get(
    '/parent/telegram-id/:telegramId',
    parentController.getParentByTelegramId
)
router.patch('/parent/:id/telegram-id', parentController.updateParentTelegramId)

// Tutor routes
router.get(
    '/tutor/phone-number/:phoneNumber',
    tutorController.getTutorByPhoneNumber
)
router.get('/tutor/username/:username', tutorController.getTutorByUsername)
router.get(
    'tutor/telegram-id/:telegramId',
    tutorController.getTutorByTelegramId
)
router.patch('/tutor/:id/telegram-id', tutorController.updateTutorTelegramId)

// Job routes
router.post('/job', jobController.createJob)
router.get('/job', jobController.getJobs)
router.get('/job/:id', jobController.getJobById)
router.put('/job/:id', jobController.updateJob)
router.delete('/job/:id', jobController.deleteJob)
router.post('/job/:id/apply', jobController.applyJob)

module.exports = router
