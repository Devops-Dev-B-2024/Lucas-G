// db.config.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

// les modèles
const db = {}

db.sequelize = sequelize
db.User = require('./models/user')(sequelize)
db.Genre = require('./models/genre')(sequelize)
db.Movie = require('./models/movie')(sequelize)
db.Rating = require('./models/rating')(sequelize)
db.Review = require('./models/review')(sequelize)


// les associations

db.Genre.hasMany(db.Movie, { foreignKey: 'genre_id' })
db.Movie.belongsTo(db.Genre, { foreignKey: 'genre_id' })

db.Movie.hasMany(db.Rating, { foreignKey: 'movie_id' })
db.Movie.hasMany(db.Review, { foreignKey: 'movie_id' })

db.User.hasMany(db.Rating, { foreignKey: 'user_id' })
db.User.hasMany(db.Review, { foreignKey: 'user_id' })

db.Rating.belongsTo(db.User, { foreignKey: 'user_id' })
db.Rating.belongsTo(db.Movie, { foreignKey: 'movie_id' })

db.Review.belongsTo(db.User, { foreignKey: 'user_id' })
db.Review.belongsTo(db.Movie, { foreignKey: 'movie_id' })

// Synchronise la base de données

db.sequelize.sync({alter: true})

module.exports = db
