const express = require('express')
const ratingController = require('../controllers/rating')
const { checkToken, authorizeUserOwnRating } = require('../jsonwebtoken/check')

let router = express.Router()

/******  Routage ressource rating  ********/

router.get('/', checkToken, ratingController.getAllRatings)
router.get('/:id', checkToken, ratingController.getRatingById)
router.post('/', checkToken, ratingController.addRating)
router.put('/:id', checkToken, authorizeUserOwnRating, ratingController.updateRating)
router.delete('/:id', checkToken, authorizeUserOwnRating, ratingController.deleteRating)


module.exports = router