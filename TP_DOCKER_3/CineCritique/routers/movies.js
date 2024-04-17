const express = require('express')
const movieController = require('../controllers/movie')
const ratingController = require('../controllers/rating')
const reviewController = require('../controllers/review')
const { checkToken, authorizeAdmin } = require('../jsonwebtoken/check')

let router = express.Router()

/******  Routage ressource genre  ********/

router.get('/', checkToken, movieController.getAllMovies)
router.get('/:id', checkToken, movieController.getMovieById)
router.post('/', checkToken, authorizeAdmin, movieController.addMovie)
router.put('/:id', checkToken, authorizeAdmin, movieController.updateMovie)
router.delete('/:id', checkToken, authorizeAdmin, movieController.deleteMovie)
router.get('/:movie_id/ratings', checkToken, ratingController.getRatingsByMovie)
router.get('/:movie_id/reviews', checkToken, reviewController.getReviewsByMovie)

module.exports = router