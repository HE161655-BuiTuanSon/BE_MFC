"use strict";
module.exports = (sequelize, DataTypes) => {
  const RequestPaymentFund = sequelize.define(
    "RequestPaymentFund",
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
      paymentMonth: {
        type: DataTypes.STRING(7),
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      note: {
        type: DataTypes.TEXT("medium"),
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
      billImage: {
        type: DataTypes.TEXT("medium"),
        allowNull: true,
      },
    },
    {
      tableName: "RequestPaymentFund",
      timestamps: true,
      underscored: false,
    }
  );

  RequestPaymentFund.associate = (models) => {
    RequestPaymentFund.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return RequestPaymentFund;
};
