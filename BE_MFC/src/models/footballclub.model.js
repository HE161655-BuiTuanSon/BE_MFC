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
      name: { type: DataTypes.STRING(255), allowNull: false },
      logo_url: { type: DataTypes.STRING(255), allowNull: false },
      time_founded: { type: DataTypes.INTEGER, allowNull: false },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      fund: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "football_clubs",
      underscored: true,
      timestamps: true,
    }
  );
};
