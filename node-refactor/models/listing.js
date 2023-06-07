'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Listing.init({
    company_name: DataTypes.STRING,
    company_logo: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    criteria: DataTypes.STRING,
    info: DataTypes.STRING,
    state: DataTypes.STRING,
    gs: DataTypes.STRING,
    subsidiary_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Listing',
  });
  return Listing;
};