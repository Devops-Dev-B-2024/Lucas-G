const { DataTypes } = require('sequelize');
const DB = require('../db.config');

module.exports = (sequelize) => {
  const Genre = sequelize.define('Genre', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(10),
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(100),
    },
  });

  Genre.afterSync(async (options) => {
    // Liste des genres à insérer
    const genresToInsert = [
      'Action',
      'Adventure',
      'Animation',
      'Biography',
      'Comedy',
      'Crime',
      'Documentary',
      'Drama',
      'Family',
      'Fantasy',
      'Film Noir',
      'History',
      'Horror',
      'Music',
      'Musical',
      'Mystery',
      'Romance',
      'Sci-Fi',
      'Short',
      'Sport',
      'Superhero',
      'Thriller',
      'War',
      'Western',
    ];

    // Vérifier si chaque genre existe avant de l'insérer
    for (const genreName of genresToInsert) {
      const existingGenre = await Genre.findOne({ where: { name: genreName } });
      if (!existingGenre) {
        await Genre.create({ name: genreName });
      }
    }
  });

  return Genre;
};
