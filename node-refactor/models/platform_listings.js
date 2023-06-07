'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class platform_listings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  platform_listings.init({
    listing_id: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'platform_listings',
  });
  return platform_listings;
};