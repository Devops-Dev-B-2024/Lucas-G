const express = require('express')
const userController = require('../controllers/user')
const ratingController = require('../controllers/rating')
const reviewController = require('../controllers/review')
const { checkToken, authorizeUserOwnProfile } = require('../jsonwebtoken/check')

let router = express.Router()

/******  Routage ressource user  ********/

router.get('/', checkToken, userController.getAllUsers);
router.get('/:id', checkToken, authorizeUserOwnProfile, userController.getUserById);
router.post('/', userController.addUser);
router.put('/:id', checkToken, authorizeUserOwnProfile, userController.updateUser);
router.delete('/:id', checkToken, authorizeUserOwnProfile, userController.deleteUser);
router.get('/:userId/ratings', checkToken, ratingController.getRatingsByUser);
router.get('/:userId/reviews', checkToken, reviewController.getReviewsByUser);

module.exports = router