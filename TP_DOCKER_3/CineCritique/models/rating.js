
const { DataTypes } = require('sequelize')
const DB = require('../db.config')


module.exports = (sequelize) => {
  const Rating = sequelize.define('Rating', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10)
      },
      rating: {
        allowNull: false,
        type: DataTypes.DECIMAL(4, 1)
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER(10)
      },
      movie_id: {
        allowNull: false,
        type: DataTypes.INTEGER(10)
      },
    })
  
    return Rating
  }