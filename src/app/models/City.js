import Sequelize, { Model } from 'sequelize';

class City extends Model {
  static init(Sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        state_name: Sequelize.STRING,
        state_initials: Sequelize.STRING,
        country_name: Sequelize.STRING,
        country_initials: Sequelize.STRING,
        visibility: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        y,
      }
    );
    return this;
  }
}
export default City;
