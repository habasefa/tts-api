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
router.get('/parent/:username', parentController.getParentByUsername)
router.patch('/parent/:id/telegram-id', parentController.updateParentTelegramId)

// Tutor routes
router.get(
    '/tutor/phone-number/:phoneNumber',
    tutorController.getTutorByPhoneNumber
)
router.get('/tutor/:username', tutorController.getTutorByUsername)
router.patch('/tutor/:id/telegram-id', tutorController.updateTutorTelegramId)

// Job routes
router.post('/job', jobController.createJob)
router.get('/job', jobController.getJobs)
router.get('/job/:id', jobController.getJobById)
router.put('/job/:id', jobController.updateJob)
router.patch('/job/:id/add-tutor', jobController.updateJob)

module.exports = router
