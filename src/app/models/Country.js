import Sequelize, { Model } from 'sequelize';

class Country extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        initials: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Country;
