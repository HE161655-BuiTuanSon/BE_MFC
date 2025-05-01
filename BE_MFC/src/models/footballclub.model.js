"use strict";

export default (sequelize, DataTypes) => {
  const FootballClub = sequelize.define(
    "FootballClub",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      founded: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      logo_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      fund: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      captainId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      treasurerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: "football_clubs",
      underscored: true,
      timestamps: true,
    }
  );

  FootballClub.associate = (models) => {
    FootballClub.belongsTo(models.User, {
      foreignKey: "captainId",
      as: "captain",
    });

    FootballClub.belongsTo(models.User, {
      foreignKey: "treasurerId",
      as: "treasurer",
    });
  };

  return FootballClub;
};
