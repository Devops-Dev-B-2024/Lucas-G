
const DB = require('../db.config')
const Review = DB.Review
const Movie = DB.Movie
const User = DB.User


/**********************************/
/*** Routage de la ressource Review */

exports.getAllReviews = (req, res) => {
    Review.findAll()
        .then(reviews => res.json({ data: reviews }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getReviewById = async (req, res) => {
    let reviewId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!reviewId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    try{
        // Récupération de la review et vérification
        let review = await Review.findOne({ where: { id: reviewId}, attributes: ['id','author','content','user_id','movie_id']})
        if (review === null) {
            return res.status(404).json({ message: 'This review does not exist !' })
        }
        return res.json({ data: review });
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }    
}

exports.addReview = async (req, res) => {
    try {
      // Extraction de l'id de l'utilisateur à partir du token
      const userId = req.user.id
  
      // Récupération du username de l'utilisateur
      const user = await User.findByPk(userId);
      const username = user.username
  
      // Ajout de l'id de l'utilisateur et le username dans le corps de la requête
      req.body.user_id = userId
      req.body.author = username
  
      // Vérification si l'utilisateur a déjà fait une review pour ce film
      const existingReview = await Review.findOne({
        where: { user_id: userId, movie_id: req.body.movie_id },
      })
      if (existingReview) {
        return res.status(409).json({ message: 'The user already reviewed this movie!' })
      }
  
      // Création d'une review
      const review = await Review.create(req.body);
      return res.json({ message: 'Review Created', data: review })
    } catch (err) { 
      if (err.name === 'SequelizeDatabaseError') {
        res.status(500).json({ message: 'Database Error', error: err })
      } else {
        res.status(500).json({ message: 'Internal Server Error', error: err })
      }
    }
  }


exports.updateReview = async (req, res) => {
    let reviewId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!reviewId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try{
        // Recherche de la review et vérification
        let review = await Review.findOne({ where: {id: reviewId}, raw: true})
        if(review === null){
            return res.status(404).json({ message: 'This review does not exist !'})
        }

        // Mise à jour du rating
        await Review.update(req.body, { where: {id: reviewId}})
        return res.json({ message: 'Review Updated'})
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}


exports.deleteReview = async (req, res) => {
    try {
        let reviewId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!reviewId) {
            return res.status(400).json({ message: 'Missing parameter' })
        }

        // Suppression de la review
        await Review.destroy({ where: { id: reviewId }, force: true })
        
        // Succès de la suppression
        return res.status(204).json({})
    } catch (err) {
        // Gestion des erreurs
        return res.status(500).json({ message: 'Database Error', error: err.message })
    }
}

exports.getReviewsByMovie = async (req, res) => {
    const movieId = parseInt(req.params.movie_id)
  
    try {
      // Vérifie si le film existe
      const movieExists = await Movie.findOne({ where: { id: movieId } })
      if (!movieExists) {
        return res.status(404).json({ message: 'Movie not found' })
      }
  
      // Récupére tous les ratings du film
      const reviews = await Review.findAll({ where: { movie_id: movieId } })
      
      return res.json({ data: reviews })
    } catch (err) {
        console.error(err)
      return res.status(500).json({ message: 'Database Error', error: err })
    }
  }

  exports.getReviewsByUser = async (req, res) => {
    const userId = req.params.userId
  
    try {
      // Vérifie si l'utilisateur existe
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
  
      // Récupére tous les reviews de l'utilisateur
      const reviews = await Review.findAll({
        where: {
          user_id: userId,
        },
      });
  
      return res.json({ data: reviews })
    } catch (err) {
      return res.status(500).json({ message: 'Database Error', error: err })
    }
  }