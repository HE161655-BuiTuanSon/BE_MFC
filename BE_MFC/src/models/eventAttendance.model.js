"use strict";
export default (sequelize, DataTypes) => {
  const EventAttendance = sequelize.define(
    "EventAttendance",
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
      eventId: {
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
      tableName: "event_attendance",
      timestamps: true,
    }
  );

  EventAttendance.associate = (models) => {
    EventAttendance.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    EventAttendance.belongsTo(models.Event, {
      foreignKey: "eventId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return EventAttendance;
};
