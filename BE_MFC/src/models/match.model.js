"use-strict";
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
        type: DataTypes.STRING(255),
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
        defaultValue: 1, // 0: not started, 1: in progress, 2: finished, 3: cancelled
        allowNull: false,
      },
      result: {
        type: DataTypes.INTEGER, // 0: draw, 1: home win, 2: away win
        allowNull: true,
      },
      money: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: "matches",
      underscored: true,
      timestamps: true,
    }
  );

  Match.associate = (models) => {
    if (models.FootballClub) {
      Match.belongsTo(models.FootballClub, {
        foreignKey: "home_team",
        as: "homeTeam",
      });
    } else {
      console.warn("models.FootballClub not found in Match.associate");
    }
  };

  return Match;
};
