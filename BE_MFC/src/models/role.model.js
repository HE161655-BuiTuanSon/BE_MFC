"use strict";
export default (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "roles",
      underscored: true,
      timestamps: true,
    }
  );
  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: "UserRoles",
      foreignKey: "roleId",
      otherKey: "userId",
    });
  };
  return Role;
};
