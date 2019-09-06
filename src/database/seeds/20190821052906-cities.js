'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const Cities = require('../data/cities.json').states;
    console.log(Cities);
    let citiesArray = [];
    Cities.forEach(citie => {
      citie.cities.forEach(cd => {
        citiesArray.push({
          state_name: citie['name'],
          state_initials: citie['initials'],
          name: cd,
          country_name: 'Brasil',
          country_initials: 'BR',
          visibility: false,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    });
    return queryInterface.bulkInsert('cities', citiesArray);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cities', null);
  },
};
