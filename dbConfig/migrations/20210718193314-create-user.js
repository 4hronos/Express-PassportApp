'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          len: [1, 100]
        }
      },
      email: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          len: [1, 255]
        }
      },
      username: {
        type: Sequelize.STRING(70),
        allowNull: false,
        validate: {
          len: [1, 100]
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User');
  }
};