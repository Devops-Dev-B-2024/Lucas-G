const express = require('express')
const genreController = require('../controllers/genre')
const movieController = require('../controllers/movie') 
const { checkToken, authorizeAdmin } = require('../jsonwebtoken/check')

let router = express.Router()

/******  Routage ressource genre  ********/

router.get('/', checkToken, genreController.getAllGenres);
router.get('/:id', checkToken, genreController.getGenreById);
router.post('/', checkToken, authorizeAdmin, genreController.addGenre);
router.put('/:id', checkToken, authorizeAdmin, genreController.updateGenre);
router.delete('/:id', checkToken, authorizeAdmin, genreController.deleteGenre);
router.get('/:genre_id/movies', checkToken, movieController.getMoviesByGenre)

module.exports = router