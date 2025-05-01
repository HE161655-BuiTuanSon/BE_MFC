"use-strict";
export default (sequelize, DataTypes) => {
  const UserClubRole = sequelize.define(
    "UserClubRole",
    {
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      club_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
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
      foreignKey: "role_id",
      as: "role",
    });
  };

  return UserClubRole;
};
