
const DB = require('../db.config')
const Rating = DB.Rating
const Movie = DB.Movie
const User = DB.User


/**********************************/
/*** Routage de la ressource Rating */

exports.getAllRatings = (req, res) => {
    Rating.findAll()
        .then(ratings => res.json({ data: ratings }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getRatingById = async (req, res) => {
    let ratingId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!ratingId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    try{
        // Récupération du rating et vérification
        let rating = await Rating.findOne({ where: { id: ratingId}, attributes: ['id','rating','user_id','movie_id']})
        if (rating === null) {
            return res.status(404).json({ message: 'This rating does not exist !' })
        }
        return res.json({ data: rating });
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }    
}

exports.addRating = async (req, res) => {

    // Extraction de l'id de l'utilisateur à partir du token
    const userId = req.user.id
    // Ajout de l'id de l'utilisateur dans le corps de la requête
    req.body.user_id = userId
    const ratingValue = parseFloat(req.body.rating);

  // Vérification si la valeur du rating est entre 0 et 10
  if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 10) {
    return res.status(400).json({ message: 'Invalid rating value. Rating must be between 0 and 10.' });
  }

    try {
      // Vérification si le rating existe déjà
      const rating = await Rating.findOne({ where: { user_id: userId, movie_id: req.body.movie_id } })
      if (rating !== null) {
        return res.status(409).json({ message: `The user already rated this movie !` })
      }
  
      // Création d'un rating
      let ratingc = await Rating.create(req.body)

      // Mise à jour de la moyenne des notes pour le film associé
      await updateMovieAverageRating(req.body.movie_id)

      return res.json({ message: 'Rating Created', data: ratingc })
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') {
        res.status(500).json({ message: 'Database Error', error: err })
      }
    }
  }



exports.updateRating = async (req, res) => {
    let ratingId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!ratingId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try{
        // Recherche du rating et vérification
        let rating = await Rating.findOne({ where: {id: ratingId}, raw: true})
        if(rating === null){
            return res.status(404).json({ message: 'This rating does not exist !'})
        }

        // Mise à jour du rating
        await Rating.update(req.body, { where: {id: ratingId}})

        // Mise à jour de la moyenne des notes pour le film associé
        await updateMovieAverageRating(rating.movie_id)

        return res.json({ message: 'Rating Updated'})
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}


exports.deleteRating = async (req, res) => {
  try {
    let ratingId = parseInt(req.params.id);

    // Vérification si le champ id est présent et cohérent
    if (!ratingId) {
      return res.status(400).json({ message: 'Missing parameter' });
    }

    // Récupération du rating avant de le supprimer
    const rating = await Rating.findByPk(ratingId);

    // Vérification si le rating existe
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Suppression du rating
    await rating.destroy({ force: true });

    // Appel à la méthode pour mettre à jour la moyenne des notes du film
    await updateMovieAverageRating(rating.movie_id);

    // Succès de la suppression
    return res.status(204).json({});
  } catch (err) {
    // Gestion des erreurs
    console.error(err);
    return res.status(500).json({ message: 'Database Error', error: err.message });
  }
}

exports.getRatingsByMovie = async (req, res) => {
    const movieId = parseInt(req.params.movie_id)
  
    try {
      // Vérifie si le film existe
      const movieExists = await Movie.findOne({ where: { id: movieId } })
      if (!movieExists) {
        return res.status(404).json({ message: 'Movie not found' })
      }
  
      // Récupére tous les ratings du film
      const ratings = await Rating.findAll({ where: { movie_id: movieId } })
      
      return res.json({ data: ratings })
    } catch (err) {
        console.error(err)
      return res.status(500).json({ message: 'Database Error', error: err })
    }
  }

  exports.getRatingsByUser = async (req, res) => {
    const userId = req.params.userId
  
    try {
      // Vérifie si l'utilisateur existe
      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
  
      // Récupére tous les ratings de l'utilisateur
      const ratings = await Rating.findAll({
        where: {
          user_id: userId,
        },
      });
  
      return res.json({ data: ratings })
    } catch (err) { 
      return res.status(500).json({ message: 'Database Error', error: err })
    }
  }

  async function updateMovieAverageRating(movieId) {
    const ratings = await Rating.findAll({
      where: { movie_id: movieId },
      attributes: [[DB.sequelize.fn('AVG', DB.sequelize.col('rating')), 'average']],
      raw: true,
    });
  
    const averageRating = ratings[0].average || 0;
  
    await Movie.update({ average_rating: averageRating }, { where: { id: movieId } });
  }