"use strict";

export default (sequelize, DataTypes) => {
  const Match = sequelize.define(
    "Match",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      home_team: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      away_team: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      home_score: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      away_score: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 0: not started, 1: in progress, 2: finished, 3: cancelled
      },
      result: {
        type: DataTypes.INTEGER, // 0: draw, 1: home win, 2: away win
        allowNull: true,
      },
      money: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      stadiumId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "Stadiums",
          key: "id",
        },
      },
      Mvp: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "matches",
      underscored: true,
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  Match.associate = (models) => {
    Match.belongsTo(models.FootballClub, {
      foreignKey: "home_team",
      as: "homeTeam",
    });

    Match.belongsTo(models.User, {
      foreignKey: "Mvp",
      as: "mvp",
    });

    Match.belongsTo(models.Stadium, {
      foreignKey: "stadiumId",
      as: "stadium",
    });
  };

  return Match;
};
