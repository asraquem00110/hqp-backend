'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    fullname: DataTypes.STRING,
    password: DataTypes.STRING,
    usertype: DataTypes.INTEGER,
    archive: DataTypes.INTEGER,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Refreshtoken)
  };

  User.loadscope = function(models){
    User.addScope("active",{
      where: {
        archive: 0,
      }
    })
  }
  return User;
};