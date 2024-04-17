
const DB = require('../db.config')
const Movie = DB.Movie
const Genre = DB.Genre

/**********************************/
/*** Routage de la ressource Movie */

exports.getAllMovies = (req, res) => {
    Movie.findAll()
        .then(movies => res.json({ data: movies }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getMovieById = async (req, res) => {
    let movieId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: 'Missing Parameter' })
    }

    try{
        // Récupération du film et vérification
        let movie = await Movie.findOne({ where: { id: movieId}, attributes: ['id','title','genre_id']})
        if (movie === null) {
            return res.status(404).json({ message: 'This movie does not exist !' })
        }
        return res.json({ data: movie });
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }    
}

exports.addMovie = async (req, res) => {
    const { title, genre_id } = req.body

    // Validation des données reçues
    if (!title || !genre_id) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    try{
        // Vérification si le film existe déjà
        const movie = await Movie.findOne({ where: { title: title }, raw: true })
        if (movie !== null) {
            return res.status(409).json({ message: `The movie ${title} already exists !` })
        }


        // Création d'un film
        let moviec = await Movie.create(req.body)
        return res.json({ message: 'Movie Created', data: moviec })

    }catch(err){
        if(err.name == 'SequelizeDatabaseError'){
            res.status(500).json({ message: 'Database Error', error: err })
        }               
    }
}



exports.updateMovie = async (req, res) => {
    let movieId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try{
        // Recherche du genre et vérification
        let movie = await Movie.findOne({ where: {id: movieId}, raw: true})
        if(movie === null){
            return res.status(404).json({ message: 'This movie does not exist !'})
        }

        // Mise à jour du genre
        await Movie.update(req.body, { where: {id: movieId}})
        return res.json({ message: 'Movie Updated'})
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}


exports.deleteMovie = async (req, res) => {
    try {
        let movieId = parseInt(req.params.id);

        // Vérification si le champ id est présent et cohérent
        if (!movieId) {
            return res.status(400).json({ message: 'Missing parameter' });
        }

        // Suppression du film
        await Movie.destroy({ where: { id: movieId }, force: true });
        
        // Succès de la suppression
        return res.status(204).json({});
    } catch (err) {
        // Gestion des erreurs
        return res.status(500).json({ message: 'Database Error', error: err.message });
    }
}

exports.getMoviesByGenre = async (req, res) => {
    const genreId = parseInt(req.params.genre_id)

    try {
        // S'assure que le genre existe
        const genre = await Genre.findOne({ where: { id: genreId } })
        if (!genre) {
            return res.status(404).json({ message: 'Genre not found' })
        }

        // Récupére les films par genre
        const movies = await Movie.findAll({ where: { genre_id: genreId } })
        return res.json({ data: movies })
    } catch (err) {
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}
