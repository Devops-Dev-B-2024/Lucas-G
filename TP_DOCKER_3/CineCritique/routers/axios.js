const express = require('express');
const router = express.Router();
const axiosController = require('../controllers/axios');
const { checkToken } = require('../jsonwebtoken/check')

router.get('/movies', checkToken, axiosController.processMovies)



module.exports = router;