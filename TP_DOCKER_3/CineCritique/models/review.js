
const { DataTypes } = require('sequelize')
const DB = require('../db.config')


module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10)
      },
      author: {
        allowNull: false,
        type: DataTypes.STRING(100)
      },
      content: {
        allowNull: false,
        type: DataTypes.TEXT
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
  
    return Review
  }