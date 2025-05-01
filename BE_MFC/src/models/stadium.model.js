"use-strict";
export default (sequelize, DataTypes) => {
  const Stadium = sequelize.define(
    "Stadium",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      stadiumName: { type: DataTypes.STRING(255), allowNull: false },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: true,
      },
    },
    {
      tableName: "stadiums",
      underscored: true,
      timestamps: true,
    }
  );

  return Stadium;
};
