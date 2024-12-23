'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Alter the Hotels table to add the new columns
    await queryInterface.addColumn('Hotels', 'type', {
      type: Sequelize.ENUM('room', 'home'),
      allowNull: false,
    });

    await queryInterface.addColumn('Hotels', 'images', {
      type: Sequelize.ARRAY(Sequelize.STRING), // This will be an array of strings
      defaultValue: [], // Default to an empty array
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes by removing the columns
    await queryInterface.removeColumn('Hotels', 'type');
    await queryInterface.removeColumn('Hotels', 'images');
  },
};
