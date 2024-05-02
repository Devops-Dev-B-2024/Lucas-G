
const { DataTypes } = require('sequelize')
const bcryptjs = require('bcryptjs')



module.exports = (sequelize) => {
  const User = sequelize.define('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10)
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: { 
          isEmail: true
        }
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i       
      },
      isAdmin: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      }
    })


  User.beforeCreate( async (user, options) => {
    let hash = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUND))
        user.password = hash
  })
  
  User.checkPassword = async (password, originel) => {
      return await bcrypt.compare(password, originel)
  }


  return User
}