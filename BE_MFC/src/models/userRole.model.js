// src/models/userRole.model.js
export default (sequelize, DataTypes) => {
  const UserRoles = sequelize.define(
    "UserRoles",
    {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "UserRoles",
      timestamps: false,
    }
  );
  UserRoles.associate = (models) => {
    UserRoles.belongsTo(models.User, { foreignKey: "userId" });
    UserRoles.belongsTo(models.Role, { foreignKey: "roleId" });
  };
  return UserRoles;
};
