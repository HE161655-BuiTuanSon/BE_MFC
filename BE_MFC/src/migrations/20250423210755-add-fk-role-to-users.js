export async function up(queryInterface, DataTypes) {
  // bảo đảm cột role_id tồn tại & kiểu đúng
  await queryInterface.changeColumn("users", "role_id", {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  });

  // thêm foreign key constraint
  await queryInterface.addConstraint("users", {
    fields: ["role_id"],
    type: "foreign key",
    references: {
      table: "roles",
      field: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeConstraint("users", "fk_users_role_id");
}
