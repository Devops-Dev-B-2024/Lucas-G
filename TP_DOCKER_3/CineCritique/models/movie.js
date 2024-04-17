
const { DataTypes } = require('sequelize')
const DB = require('../db.config')


module.exports = (sequelize) => {
  const Movie = sequelize.define('Movie', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10)
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(100),
        unique: true
      },
      average_rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0, 
      },
      genre_id: {
        allowNull: false,
        type: DataTypes.INTEGER(10)
      },
    })
  
    return Movie
  }