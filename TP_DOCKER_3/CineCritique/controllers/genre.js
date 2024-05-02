
const DB = require('../db.config')
const Genre = DB.Genre
const Movie = DB.Movie

/**********************************/
/*** Routage de la ressource Genre */

exports.getAllGenres = (req, res) => {
    Genre.findAll()
        .then(genres => res.json({ data: genres }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getGenreById = async (req, res) => {
    let genreId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!genreId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    try{
        // Récupération du genre et vérification
        let genre = await Genre.findOne({ where: { id: genreId}, attributes: ['id','name']})
        if (genre === null) {
            return res.status(404).json({ message: 'This genre does not exist !' })
        }
        return res.json({ data: genre });
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }    
}

exports.addGenre = async (req, res) => {
    const { name } = req.body

    // Validation des données reçues
    if (!name) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    try{
        // Vérification si le genre existe déjà
        const genre = await Genre.findOne({ where: { name: name }, raw: true })
        if (genre !== null) {
            return res.status(409).json({ message: `The genre ${name} already exists !` })
        }


        // Création d'un genre
        let genrec = await Genre.create(req.body)
        return res.json({ message: 'Genre Created', data: genrec })

    }catch(err){
        if(err.name == 'SequelizeDatabaseError'){
            res.status(500).json({ message: 'Database Error', error: err })
        }               
    }
}



exports.updateGenre = async (req, res) => {
    let genreId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!genreId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try{
        // Recherche du genre et vérification
        let genre = await Genre.findOne({ where: {id: genreId}, raw: true})
        if(genre === null){
            return res.status(404).json({ message: 'This genre does not exist !'})
        }

        // Mise à jour du genre
        await Genre.update(req.body, { where: {id: genreId}})
        return res.json({ message: 'Genre Updated'})
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}


exports.deleteGenre = async (req, res) => {
    try {
        let genreId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!genreId) {
            return res.status(400).json({ message: 'Missing parameter' })
        }

        // Suppression du genre
        await Genre.destroy({ where: { id: genreId }, force: true })
        
        // Succès de la suppression
        return res.status(204).json({})
    } catch (err) {
        // Gestion des erreurs
        return res.status(500).json({ message: 'Database Error', error: err.message })
    }
}

