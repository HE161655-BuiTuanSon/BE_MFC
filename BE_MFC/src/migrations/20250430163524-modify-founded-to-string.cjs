"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("FootballClubs", "founded", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("FootballClubs", "founded", {
      type: Sequelize.INTEGER,
    });
  },
};
