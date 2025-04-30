"use strict";
export default (sequelize, DataTypes) => {
  const MatchAttendance = sequelize.define(
    "MatchAttendance",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
      matchId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      attendanceStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        allowNull: false,
      },
      joinTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "match_attendance",
      timestamps: true,
    }
  );

  MatchAttendance.associate = (models) => {
    MatchAttendance.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    MatchAttendance.belongsTo(models.Event, {
      foreignKey: "matchId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return MatchAttendance;
};
