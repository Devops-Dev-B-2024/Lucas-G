const express = require('express')
const authController = require('../controllers/auth')

let router = express.Router()

router.post('/login', authController.login)

module.exports = router