const axios = require('axios');
const apiKey = 'bc3e88e5'; 
const DB = require('../db.config')
const Genre = DB.Genre
const Movie = DB.Movie


// Fonction pour obtenir les noms des films de 2022
async function getMovieNames() {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?s=movie&y=2022&apikey=${apiKey}`);
    return response.data.Search.map(movie => movie.Title);
  } catch (error) {
    console.error('Erreur lors de la récupération des noms des films :', error.message);
    return [];
  }
}

// Fonction pour récuperer les genres grâce aux titres des films
async function getGenresForMovie(movieName) {
  try {
    const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${apiKey}`);
    const genres = response.data.Genre.split(',').map(genre => genre.trim());
    
    // Retourne seulement le premier genre
    return genres.length > 0 ? genres[0] : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération des genres pour "${movieName}" :`, error.message);
    return null;
  }
}

// Fonction pour comparer le genre du film à celui de la bdd des genres pour lui donner l'id_genre correspondant
async function getGenreIdByName(genreName) {
  try {
    const genre = await Genre.findOne({
      where: { name: genreName }
    });

    return genre ? genre.id : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'ID du genre "${genreName}" :`, error.message);
    return null;
  }
}

exports.processMovies = async function (req, res) {
  try {
    const movieNames = await getMovieNames();

    for (const movieName of movieNames) {
      const genreName = await getGenresForMovie(movieName);

      if (genreName !== null) {
        const genreId = await getGenreIdByName(genreName);

        if (genreId !== null) {
          // Vérifie si le film existe déjà dans la base de données
          const [movie, created] = await DB.Movie.findOrCreate({
            where: { title: movieName },
            defaults: {
              title: movieName,
              genre_id: genreId,
              // Autres champs du film à insérer
            }
          });

          if (created) {
            console.log(`Le film "${movieName}" a été inséré avec l'id_genre : ${genreId}`);
          } else {
            console.log(`Le film "${movieName}" existe déjà dans la base de données.`);
          }
        } else {
          console.log(`Impossible de récupérer l'ID du genre pour "${movieName}"`);
        }
      } else {
        console.log(`Impossible de récupérer le genre pour "${movieName}"`);
      }
    }

    // Indique que le traitement est terminé avec succès
    res.status(200).send('Traitement terminé avec succès');
  } catch (error) {
    console.error('Une erreur s\'est produite lors du traitement des films :', error);
    // Indique une erreur interne du serveur
    res.status(500).send('Erreur interne du serveur');
  }
};


