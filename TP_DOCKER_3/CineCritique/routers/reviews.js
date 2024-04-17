const express = require('express')
const reviewController = require('../controllers/review')
const { checkToken, authorizeUserOwnReview  } = require('../jsonwebtoken/check')

let router = express.Router()

/******  Routage ressource rating  ********/

router.get('/', checkToken, reviewController.getAllReviews)
router.get('/:id', checkToken, reviewController.getReviewById)
router.post('/', checkToken, reviewController.addReview)
router.put('/:id', checkToken, authorizeUserOwnReview, reviewController.updateReview)
router.delete('/:id', checkToken, authorizeUserOwnReview, reviewController.deleteReview)


module.exports = router