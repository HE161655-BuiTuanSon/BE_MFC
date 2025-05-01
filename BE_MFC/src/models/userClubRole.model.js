"use-strict";
export default (sequelize, DataTypes) => {
  const UserClubRole = sequelize.define(
    "UserClubRoles",
    {
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      club_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: "roleId",
        allowNull: false,
      },
    },
    {
      tableName: "UserClubRoles",
      underscored: true,
      timestamps: true,
    }
  );
  UserClubRole.associate = (models) => {
    UserClubRole.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    UserClubRole.belongsTo(models.FootballClub, {
      foreignKey: "club_id",
      as: "club",
    });
    UserClubRole.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });
  };

  return UserClubRole;
};
