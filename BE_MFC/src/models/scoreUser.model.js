"use strict";
module.exports = (sequelize, DataTypes) => {
  const ScoreUser = sequelize.define(
    "ScoreUser",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      matchId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "Matches",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "ScoreUser",
      timestamps: false,
    }
  );

  ScoreUser.associate = (models) => {
    ScoreUser.belongsTo(models.Match, {
      foreignKey: "matchId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    ScoreUser.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return ScoreUser;
};
