"use strict";
export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      facebook_id: DataTypes.STRING,
      avatar_url: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      score: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "users",
      underscored: true,
      timestamps: true,
      defaultScope: { attributes: { exclude: ["password"] } },
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: "role_id",
      as: "role",
    });
  };

  return User;
};
