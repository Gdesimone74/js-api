'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subsidiary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subsidiary.init({
    name: DataTypes.STRING,
    logo: DataTypes.STRING,
    country_id: DataTypes.STRING,
    company_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subsidiary',
  });
  return Subsidiary;
};