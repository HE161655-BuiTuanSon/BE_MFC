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
        field: "isActive",
        defaultValue: true,
      },
      fund: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      captainId: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: "captainId",
        allowNull: true,
      },
      treasurerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: "treasurerId",
        allowNull: true,
      },
    },
    {
      tableName: "FootballClubs",
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
